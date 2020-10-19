import React, { useState, useEffect } from "react";
import { sendEmail } from "../../ses";
import axios from "../axios";
export default function Recipes() {
    const [allRecipes, setAllRecipes] = useState();
    const [error, setError] = useState();
    const [recipeModal, setRecipeModal] = useState(false);
    const [recipe, setRecipe] = useState();
    const [email, setEmail] = useState();
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);
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
        setSuccess(false);
        setFail(false);
    }
    function getEmail({ target }) {
        setEmail(target.value);
    }
    function sendEmail() {
        const title = recipe[0].title;
        (async () => {
            const { data } = await axios.post("/sendRecipeEmail", {
                email,
                title,
            });
            if (data.success) {
                console.log("email has been sent");
                setSuccess(true);
            } else {
                console.log("enter valid email");
                setFail(true);
            }
        })();
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

                        <div>
                            <h3 id="sendrecipe">
                                Send recipe via mail to:{" "}
                                <input onChange={(e) => getEmail(e)}></input>
                                <br></br>
                                <button onClick={sendEmail}>send</button>
                                {success && (
                                    <p>
                                        The recipe has been sent! Enjoy your
                                        meal!
                                    </p>
                                )}
                                {fail && (
                                    <p className="error">
                                        Please enter a valid email address!
                                    </p>
                                )}
                            </h3>
                        </div>
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
