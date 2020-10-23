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
//app.js
app.get("/userProfile", (req, res) => {
    const userId = req.session.userId;
    db.getUserData(userId)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((error) => {
            res.json({
                error:
                    "Sorry, there seems to be a problem with the database! Try to reload!",
            });
            console.log("error in get/userProfile in DB ", error);
        });
});
app.post("/modifyImage", uploader.single("file"), s3.upload, (req, res) => {
    const userId = req.session.userId;
    db.modifyImage(userId, config.s3Url + req.file.filename)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((error) => {
            res.json({ error: true });
            console.log("error in adding image to DB", error);
        });
});
app.post("/modifyProfile", (req, res) => {
    console.log("req.body: ", req.body);
    const { userId } = req.session;
    let { first, last, email, password } = req.body;
    db.getUserData(userId).then((userdata) => {
        console.log("userdata: ", userdata.rows[0]);
        if (!first) {
            first = userdata.rows[0].firstname;
        }
        if (!last) {
            last = userdata.rows[0].lastname;
        }
        if (!email) {
            email = userdata.rows[0].email;
        }
        if (!password) {
            password = userdata.rows[0].password;
            console.log("nopasswordchange: ", first, last, email, password);
            db.modifyProfile(first, last, email, password, userId)
                .then((result) => {
                    // res.json(result.rows[0], { success: true });
                    res.json(result.rows[0]);
                })
                .catch((error) => {
                    console.log("error in modifying profile", error);
                    res.json({
                        error:
                            "Sorry, there is a problem in the database, we could´t update your data!",
                    });
                });
        } else {
            console.log("passwordchange: ", first, last, email, password);
            hash(password).then((hashed) => {
                const hashedPW = hashed;
                db.modifyProfile(first, last, email, hashedPW, userId)
                    .then(() => {
                        res.json({ success: true });
                    })
                    .catch((error) => {
                        console.log("error in modifying profile", error);
                        res.json({
                            error:
                                "Sorry, there is a problem in the database, we could´t update your data!",
                        });
                    });
            });
        }
    });
});
app.get("/allrecipes", (req, res) => {
    db.getAllRecipes()
        .then((allRecipes) => {
            console.log("allRecipes: ", allRecipes.rows);
            res.json(allRecipes.rows);
        })
        .catch((error) => {
            console.log("error in getting all recipes", error);
            res.json({
                error: "Sorry we could not load the images from the database!",
            });
        });
});
app.get("/recipeDetails/:recipeId", (req, res) => {
    const { recipeId } = req.params;
    db.getRecipe(recipeId)
        .then((recipe) => {
            console.log("recipe: ", recipe.rows);
            res.json(recipe.rows);
        })
        .catch((error) => {
            res.json({
                error: "Sorry, the recipe couldn´t be retrieved from the DB.",
            });
            console.log("error in getting recipe from db", error);
        });
});
app.post("/filteredRecipe", (req, res) => {
    const ingredient = req.body.ingredients[0];
    //get veggie recipes
    if (ingredient === "veggie") {
        db.getVeggieRecipes()
            .then((recipes) => {
                console.log("recipes", recipes.rows);
                res.json(recipes.rows);
            })
            .catch((error) => {
                console.log("error in getting veggie recipes from db", error);
            });
    } else if (ingredient === "vegan") {
        db.getVeganRecipes()
            .then((recipes) => {
                console.log("recipes", recipes.rows);
                res.json(recipes.rows);
            })
            .catch((error) => {
                console.log("error in getting vegan recipes from db", error);
            });
    } else if (ingredient === "lactosefree") {
        db.getLactosefreeRecipes()
            .then((recipes) => {
                console.log("recipes", recipes.rows);
                res.json(recipes.rows);
            })
            .catch((error) => {
                console.log(
                    "error in getting lactosefree recipes from db",
                    error
                );
            });
    } else if (ingredient === "glutenfree") {
        db.getGlutenfreefreeRecipes()
            .then((recipes) => {
                console.log("recipes", recipes.rows);
                res.json(recipes.rows);
            })
            .catch((error) => {
                console.log(
                    "error in getting lactosefree recipes from db",
                    error
                );
            });
    } else {
        //get recipes with selected ingredient
        db.getFilteredRecipes(ingredient)
            .then((recipes) => {
                console.log("recipes", recipes.rows);
                res.json(recipes.rows);
            })
            .catch((error) => {
                console.log(
                    "error in getting all filtered recipes from db",
                    error
                );
            });
    }
});
app.post("/sendRecipeEmail", (req, res) => {
    console.log("req.body: ", req.body);
    const { email, title } = req.body;
    db.getEmailRecipe(title)
        .then((recipe) => {
            console.log("desired recipe: ", recipe.rows);
            const newTitle = recipe.rows[0].title;
            const instructions = recipe.rows[0].instructions;
            const ingredients = [];
            for (let i = 0; i < recipe.rows.length; i++) {
                ingredients.push(
                    [
                        " ",
                        recipe.rows[i].quantity,
                        recipe.rows[i].description,
                        recipe.rows[i].name,
                    ].join(" ")
                );
            }
            console.log("ingredients: ", ingredients);
            ses.sendEmail(
                email,
                `Dear FOODIE., To make yourself a delicious ${newTitle}, follow these steps: ${instructions} You need to buy the following ingredients: ${ingredients}. ENJOY!`,
                `FOODIE.: ${newTitle}`
            )
                .then(() => res.json({ success: true }))
                .catch((error) => {
                    res.json({ success: false });
                    console.log("error in sending new code via email", error);
                });
        })
        .catch((error) => {
            res.json({ success: false });
            console.log("error in getting desired recipe", error);
        });
});
app.get("/images", (req, res) => {
    console.log("in images");
    db.getImages()
        .then((result) => {
            console.log("resultOnServer: ", result.rows);
            res.json(result.rows);
        })
        .catch((error) => console.log("error in getImages", error));
});
app.post(
    "/imageboardUpload",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        const input = JSON.parse(req.body.values);
        const { title, description, username } = input;
        db.addImagetoDB(
            config.s3Url + req.file.filename,
            username,
            title,
            description
        )
            .then((result) => {
                // console.log("result.rows[0]", result.rows[0]);
                res.json(result.rows[0]);
            })
            .catch((error) => {
                res.json({ error: true });
                console.log("error in adding imagedata to DB", error);
            });
    }
);
app.get("/wishlist", (req, res) => {
    const userId = req.session.userId;
    db.getWishlist(userId)
        .then((result) => {
            console.log("res.rows", result.rows);
            res.json(result.rows);
        })
        .catch((error) => {
            console.log("error in getting wishlist", error);
        });
});
app.post("/addToWishlist", (req, res) => {
    const recipe_title = req.body.title;
    const userId = req.session.userId;
    db.addToWishlist(userId, recipe_title)
        .then((result) => {
            console.log("result", result);
            res.json({ success: true });
        })
        .catch((error) => {
            console.log("error in adding wishlist", error);
            res.json({ success: false });
        });
});
app.post("/sendSuggestions", (req, res) => {
    const text = req.body.emailtext;
    const foodieEmail = "everlasting.plutonium@spicedling.email";
    ses.sendEmail(foodieEmail, text, "Suggestions")
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.json({ success: false });
            console.log("error in sending email", error);
        });
});
app.post("/likes", (req, res) => {
    const commentId = req.body.id;
    console.log("commentid: ", commentId);
    db.addLikes(commentId)
        .then((result) => {
            console.log("result.rows: ", result.rows);
            db.getImages().then((result) => {
                console.log(result.rows);
                res.json(result.rows);
            });
        })
        .catch((error) => console.log("error in posting likes", error));
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
