import React, { useState } from "react";
import axios from "../axios";
export default function FilterRecipes() {
    const [filter, setFilter] = useState(true);
    const [ingredients, setIngredients] = useState([]);
    const [filteredRecipe, setFilteredRecipes] = useState();
    const [noResult, setNoResult] = useState();
    // modalstuff
    const [recipeModal, setRecipeModal] = useState(false);
    const [recipe, setRecipe] = useState();

    function handleChange({ target }) {
        console.log(target.name, target.value);
        setIngredients((ingredient) => {
            return [...ingredient, target.name];
        });
    }
    function getRecipes() {
        console.log("ingredients: ", { ingredients });
        setFilter(false);
        (async () => {
            const { data } = await axios.post("/filteredRecipe", {
                ingredients,
            });
            console.log("data: ", data);
            if (data.length === 0) {
                console.log("no recipes");
                setNoResult(
                    <h3 className="error">
                        Sorry, there are no matching recipes so far!
                    </h3>
                );
            } else {
                setFilteredRecipes(data);
            }
        })();
    }
    function changeIngredient() {
        setFilter(true);
        setFilteredRecipes(false);
        location.replace("/filterrecipes");
    }
    function showRecipe(id) {
        setRecipeModal(true);
        const recipeId = id;
        (async () => {
            try {
                const { data } = await axios.get(`/recipeDetails/${recipeId}`);
                console.log("recipe: ", data);
                setRecipe(data);
            } catch (error) {
                console.log("error in getting recipe details", error);
            }
        })();
    }
    function closeRecipeModal() {
        setRecipeModal(false);
    }
    return (
        <React.Fragment>
            {filter && (
                <div>
                    <div id="checkboxheader">
                        <h1>
                            Choose one ingredient you are craving for today!
                        </h1>
                    </div>
                    <div id="checkboxescontainer">
                        <div className="category">
                            <h2>Vegetable:</h2>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="avocado"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="avocado"> 🥑</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="brokkoli"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="brokkoli"> 🥦</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="garlic"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="garlic"> 🧄</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="lemon"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="lemon"> 🍋</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="onion"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="onion"> 🧅</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="paprika"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="paprika"> 🌶</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="potatoe"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="potatoe"> 🥔</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="spinach"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="spinach"> 🥬</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="tomato"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="tomato"> 🍅</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="zucchini"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="zucchini"> 🥒</label>
                            </div>
                        </div>
                        <div className="category">
                            <h2>Meat:</h2>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="bacon"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="bacon"> 🥓</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="pork"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="pork"> 🐷</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="salmon"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="salmon"> 🍣</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="shrimps"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="shrimps"> 🍤</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="beef"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="beef"> 🥩</label>
                            </div>
                        </div>
                        <div className="category">
                            <h2>Carbs:</h2>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="burger-buns"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="burger-buns"> 🥯</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="bread"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="bread"> 🍞</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="pasta"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="pasta"> 🍝</label>
                            </div>
                            <div className="item">
                                <input
                                    type="checkbox"
                                    name="rice"
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor="rice"> 🍚</label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {filter && (
                <div className="changeIngredient">
                    <button onClick={getRecipes}>get recipes</button>
                </div>
            )}
            <div id="recipesMain">
                {filteredRecipe &&
                    filteredRecipe.map((recipe, i) => {
                        return (
                            <div
                                id="recipeContainer"
                                key={i}
                                onClick={() => showRecipe(recipe.id)}
                            >
                                <img
                                    src={recipe.image_url}
                                    className="recipeImg"
                                />
                                <h3 className="recipeName">{recipe.title}</h3>
                            </div>
                        );
                    })}
            </div>
            <div id="modalMain">
                {recipeModal && (
                    <div id="recipeModal">
                        <div id="close" onClick={closeRecipeModal}>
                            X
                        </div>
                        {recipe && (
                            <div id="header">
                                <h1>{recipe[0].title}</h1>
                                <br></br>
                                <p>➡️ {recipe[0].instructions}</p>
                                <br></br>
                                <h2> Ingredients:</h2>
                            </div>
                        )}

                        {recipe &&
                            recipe.map((r, i) => {
                                return (
                                    <div id="ingredients" key={i}>
                                        <ul>
                                            <li>
                                                {r.quantity} {r.description}{" "}
                                                {r.name}
                                            </li>
                                        </ul>
                                    </div>
                                );
                            })}
                        <br></br>
                        <br></br>
                        <div>
                            <h3 id="sendrecipe">
                                Send recipe via mail to: <input></input>
                            </h3>
                        </div>
                    </div>
                )}
            </div>
            {filteredRecipe && (
                <div className="changeIngredient">
                    <button onClick={changeIngredient}>
                        change Ingredient
                    </button>
                </div>
            )}
            {noResult && (
                <div className="changeIngredient">
                    {noResult}
                    <button onClick={changeIngredient}>
                        change Ingredient
                    </button>
                </div>
            )}
        </React.Fragment>
    );
}
