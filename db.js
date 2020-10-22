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
exports.modifyImage = (userId, image_url) => {
    const q = `UPDATE users SET image_url = $2 WHERE id=$1 RETURNING *`;
    const params = [userId, image_url];
    return db.query(q, params);
};
exports.modifyProfile = (first, last, email, hashedPW, userId) => {
    const q = `UPDATE users
      SET firstname=$1, lastname=$2, email=$3, password=$4
      WHERE id=$5 RETURNING *;
    `;
    const params = [first, last, email, hashedPW, userId];
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
exports.getFilteredRecipes = (ingredient) => {
    const q = `SELECT recipes.id, recipes.title,recipes.image_url
               FROM recipe_ingredients
               JOIN recipes ON recipes_id = recipes.id
               JOIN quantities ON quantities_id = quantities.id
               JOIN units ON units_id = units.id
               JOIN ingredients ON ingredients_id = ingredients.id
               WHERE ingredients.name = $1;`;
    const params = [ingredient];
    return db.query(q, params);
};
exports.getVeggieRecipes = () => {
    const q = `SELECT recipes.id, recipes.title,recipes.image_url
               FROM recipes
               WHERE recipes.veggie = TRUE;`;
    return db.query(q);
};
exports.getVeganRecipes = () => {
    const q = `SELECT recipes.id, recipes.title,recipes.image_url
               FROM recipes
               WHERE recipes.vegan = TRUE;`;
    return db.query(q);
};
exports.getLactosefreeRecipes = () => {
    const q = `SELECT recipes.id, recipes.title,recipes.image_url
               FROM recipes
               WHERE recipes.lactosefree = TRUE;`;
    return db.query(q);
};
exports.getGlutenfreefreeRecipes = () => {
    const q = `SELECT recipes.id, recipes.title,recipes.image_url
               FROM recipes
               WHERE recipes.glutenfree = TRUE;`;
    return db.query(q);
};

exports.getEmailRecipe = (title) => {
    const q = `SELECT recipes.title,recipes.instructions,quantities.quantity,units.description,ingredients.name
               FROM recipe_ingredients
               JOIN recipes ON recipes_id = recipes.id
               JOIN quantities ON quantities_id = quantities.id
               JOIN units ON units_id = units.id
               JOIN ingredients ON ingredients_id = ingredients.id
               WHERE recipes.title = $1;`;
    const params = [title];
    return db.query(q, params);
};
exports.getImages = () => {
    const q = `SELECT * FROM images ORDER BY id DESC;`;
    return db.query(q);
};
exports.addImagetoDB = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description)
     VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [url, username, title, description];
    return db.query(q, params);
};
exports.getWishlist = (userId) => {
    const q = `SELECT recipe_title FROM wishlist WHERE user_id=$1;`;
    const params = [userId];
    return db.query(q, params);
};
exports.addToWishlist = (userId, recipe_title) => {
    const q = `INSERT INTO wishlist (user_id, recipe_title) VALUES($1,$2)`;
    const params = [userId, recipe_title];
    return db.query(q, params);
};
