DROP TABLE IF EXISTS recipes CASCADE;
CREATE TABLE recipes(
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
instructions TEXT NOT NULL,
image_url VARCHAR DEFAULT NULL
);

DROP TABLE IF EXISTS recipe_ingredients CASCADE;
CREATE TABLE recipe_ingredients(
id SERIAL PRIMARY KEY,
recipes_id INT REFERENCES recipes(id) NOT NULL,
quantities_id INT REFERENCES quantities(id) ,
units_id INT REFERENCES units(id) , 
ingredients_id INT REFERENCES ingredients(id) NOT NULL
);

DROP TABLE IF EXISTS ingredients CASCADE;
CREATE TABLE ingredients(
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
-- meat, substitute, carb, vegetable, fruit
category VARCHAR(255)
);

DROP TABLE IF EXISTS quantities CASCADE;
CREATE TABLE quantities(
id SERIAL PRIMARY KEY,
quantity INT 
);

-- g,kg,ml,l, bag, pack, teaspoon, tablespoon
DROP TABLE IF EXISTS units CASCADE;
CREATE TABLE units(
id SERIAL PRIMARY KEY,
description VARCHAR(255)
);



-- to ask;
-- for units how to do automatically like 1-500 fe?
-- in recipes save image_url from public folder? and later if "i cooked it" features is ready with multer?
-- https://dataschool.com/learn-sql/importing-data-from-csv-in-postgresql/

-- good to have:
-- https://www.w3schools.com/sql/sql_alter.asp (how to add/delete columns)
-- https://rapidapi.com/spoonacular/api/recipe-food-nutrition/endpoints maybe additionally work with this API for features