import React, { useState, useEffect } from "react";
import axios from "../axios";
import Email from "./email";
export default function Recipes() {
    const [allRecipes, setAllRecipes] = useState();
    const [error, setError] = useState();
    const [recipeModal, setRecipeModal] = useState(false);
    const [recipe, setRecipe] = useState();

    useEffect(() => {
        console.log("Recipes has mounted");
        (async () => {
            try {
                const { data } = await axios.get("/allrecipes");
                console.log("all recipes: ", data);
                if (data.error) {
                    setError(data.error);
                } else {
                    setAllRecipes(data);
                }
            } catch (error) {
                console.log("error in getting all recipes", error);
            }
        })();
    }, []);
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
        <div>
            <div id="modalMain">
                {error && <h3 className="error">{error}</h3>}
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
                        {recipe && <Email props={recipe[0].title} />}
                    </div>
                )}
            </div>
            <div id="recipesMain">
                {allRecipes &&
                    allRecipes.map((recipe, i) => {
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
        </div>
    );
}
