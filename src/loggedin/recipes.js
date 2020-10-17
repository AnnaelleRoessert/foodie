import React, { useState, useEffect } from "react";
import axios from "../axios";
export default function Recipes() {
    const [allRecipes, setAllRecipes] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        console.log("Recipes has mounted");
        (async () => {
            try {
                const { data } = await axios.get("/allrecipes");
                console.log("all recipes: ", data);
                if (data.error) {
                    setError(data.error);
                } else {
                    console.log("url: ", data[0].image_url);
                    setAllRecipes(data);
                }
            } catch (error) {
                console.log("error in getting all recipes", error);
            }
        })();
    }, []);
    function showRecipe() {
        console.log("clicked");
        // why the hell can´t i give recipe.id as argument????
    }
    return (
        <div>
            {error && <h3 className="error">{error}</h3>}
            <div id="recipesMain">
                {allRecipes &&
                    allRecipes.map((recipe, i) => {
                        return (
                            <div
                                id="recipeContainer"
                                key={i}
                                onClick={showRecipe()}
                            >
                                <img
                                    src="/foodpictures/almondquiche.jpeg"
                                    // src={recipe.image_url}??????WHICH PATH
                                    className="recipeImg"
                                />
                                <h3 id="recipeName">{recipe.name}</h3>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
