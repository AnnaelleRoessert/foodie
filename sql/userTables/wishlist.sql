DROP TABLE IF EXISTS wishlist CASCADE;
CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    recipe_title TEXT NOT NULL
);  