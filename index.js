//modules
const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const { compare, hash } = require("./bc");
const db = require("./db.js");
const csurf = require("csurf");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
const s3 = require("./s3");
const config = require("./config.json");
//middlewares
app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

let secrets;
process.env.NODE_ENV === "production"
    ? (secrets = process.env)
    : (secrets = require("./secrets"));
app.use(
    cookieSession({
        secret: `${secrets.sessionSecret}`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
app.use(express.static("./public"));

//routes
//welcome.js
app.get("/welcome", function (req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//registration.js
app.post("/register", (req, res) => {
    console.log("req.body: ", req.body);
    const { first, last, email, password } = req.body;
    if (!first || !last || !email || !password) {
        res.json({ success: false });
    } else {
        hash(password).then((hashed) => {
            const hashedPW = hashed;
            db.addUser(first, last, email, hashedPW)
                .then((result) => {
                    console.log("id: ", result.rows[0].id);
                    const id = result.rows[0].id;
                    req.session.userId = id;
                    res.json({ success: true });
                })
                .catch((error) =>
                    console.log("error in /registration DB adding user", error)
                );
        });
    }
});
//login.js
app.post("/login", (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({ success: false });
    } else {
        db.getPW(email)
            .then((result) => {
                const hashedPW = result.rows[0].password;
                compare(password, hashedPW)
                    .then((check) => {
                        if (check) {
                            const userId = result.rows[0].id;
                            req.session.userId = userId;
                            res.json({ success: true });
                        } else {
                            res.json({ success: false });
                        }
                    })
                    .catch((error) =>
                        console.log("error in comparing passwords", error)
                    );
            })
            .catch((error) =>
                console.log("error in DB getting password", error)
            );
    }
});
// resetPassword.js
app.post("/resetPasswordStep1", (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.json({ success: false });
    } else {
        const secretCode = cryptoRandomString({
            length: 6,
        });
        db.addPWCode(email, secretCode)
            .then(() => {
                ses.sendEmail(
                    email,
                    `This is your reset code: ${secretCode}.`,
                    "Reset your Password on Ellebook"
                )
                    .then(() => res.json({ success: true }))
                    .catch((error) => {
                        res.json({ success: false });
                        console.log(
                            "error in sending new code via email",
                            error
                        );
                    });
            })
            .catch((error) => {
                res.json({ success: false });
                console.log("error in DB adding PW Codes", error);
            });
    }
});
app.post("/resetPasswordStep2", (req, res) => {
    const { email, code, password } = req.body;
    if (!email || !code || !password) {
        res.json({ success: false });
    } else {
        db.verifyCode(email)
            .then((codeInDB) => {
                console.log("codeInDB: ", codeInDB.rows[0].code);
                if (code == codeInDB.rows[0].code) {
                    hash(password)
                        .then((hashed) => {
                            const hashedPW = hashed;
                            db.updatePW(email, hashedPW).then(() =>
                                res.json({ success: true })
                            );
                        })
                        .catch((error) => {
                            res.json({ success: false });
                            console.log("error in updating PW", error);
                        });
                } else {
                    res.json({ success: false });
                }
            })
            .catch((error) => {
                res.json({ success: false });
                console.log("error in verifying code", error);
            });
    }
});
app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});
app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//server
app.listen(8080, function () {
    console.log("I'm listening.");
});
