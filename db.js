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

exports.getPW = (email) => {
    const q = `SELECT password, id FROM users WHERE email=$1;`;
    const params = [email];
    return db.query(q, params);
};
exports.addPWCode = (email, code) => {
    const q = `INSERT INTO password_reset_codes (email, code)
    VALUES ($1,$2)`;
    const params = [email, code];
    return db.query(q, params);
};
exports.verifyCode = (email) => {
    const q = `SELECT code FROM password_reset_codes WHERE email = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' ORDER BY created_at DESC LIMIT 1;`;
    const params = [email];
    return db.query(q, params);
};
exports.updatePW = (email, hashedPW) => {
    const q = `UPDATE users SET password=$2 WHERE email = $1;`;
    const params = [email, hashedPW];
    return db.query(q, params);
};
exports.getUserData = (userId) => {
    const q = `SELECT *  FROM users WHERE id=$1`;
    const params = [userId];
    return db.query(q, params);
};
exports.modifyProfile = (userId, image_url) => {
    const q = `UPDATE users SET image_url = $2 WHERE id=$1 RETURNING *`;
    const params = [userId, image_url];
    return db.query(q, params);
};
exports.getAllRecipes = () => {
    const q = `SELECT id,title,image_url FROM recipes ORDER BY title ASC`;
    return db.query(q);
};
exports.getRecipe = (recipeId) => {
    const q = `SELECT recipes.title,recipes.instructions,quantities.quantity,units.description,ingredients.name
               FROM recipe_ingredients
               JOIN recipes ON recipes_id = recipes.id
               JOIN quantities ON quantities_id = quantities.id
               JOIN units ON units_id = units.id
               JOIN ingredients ON ingredients_id = ingredients.id
               WHERE recipes_id = $1;`;
    const params = [recipeId];
    return db.query(q, params);
};
