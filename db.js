const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/allaboutfood"
);
exports.addUser = (firstname, lastname, email, hashedPW) => {
    const q = `INSERT INTO users (firstname, lastname, email, password)
VALUES ($1, $2, $3, $4) RETURNING id; `;
    const params = [firstname, lastname, email, hashedPW];
    return db.query(q, params);
};
