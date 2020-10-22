import React, { useState, useEffect } from "react";
import axios from "../axios";
export default function Nutrition() {
    const [nutritionReq, setNutritionReq] = useState();
    const [response, setResponse] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        console.log("Nutrition has mounted");
    }, []);
    function handleChange({ target }) {
        // console.log("nutritioninput: ", target.value);
        if (target.value === "") {
            setNutritionReq("");
            setError("");
        } else {
            setNutritionReq(target.value);
        }
    }
    function getNutritionInfos() {
        // console.log("nutritionreq: ", nutritionReq);
        const options = {
            method: "GET",
            url: "https://rapidapi.p.rapidapi.com/api/nutrition-data",
            params: { ingr: `${nutritionReq}` },
            headers: {
                "x-rapidapi-host":
                    "edamam-edamam-nutrition-analysis.p.rapidapi.com",
                "x-rapidapi-key":
                    "e4b741b69amshdd332413942b659p1eb681jsn6f224630e12e",
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                if (response.data.totalWeight === 0) {
                    setError(
                        <h3 className="error">
                            Sorry, there are no results for your request!
                        </h3>
                    );
                } else {
                    setResponse(response.data);
                }
            })
            .catch(function (error) {
                console.error(error);
                setError(
                    <h3 className="error">
                        Sorry, there are no results for your request!
                    </h3>
                );
            });
    }
    return (
        <div id="nutritionmain">
            <h1>
                Curious about nutritions or unsure if you have intolerances?
            </h1>
            <br></br>
            <input
                type="text"
                name="nutrition"
                autoComplete="off"
                onChange={(e) => handleChange(e)}
            ></input>
            <br></br>
            <button onClick={getNutritionInfos}>get nutrition infos</button>
            {error && error}
            {response && (
                <div id="responsefromapi">
                    <div>
                        <h3>Calories: {response.calories}</h3>
                        <h3>Est. weight: {response.totalWeight} g</h3>
                        <h3>
                            Cautious about:{" "}
                            <ul>
                                {response.cautions.map((item, i) => {
                                    return <li key={i}>{item}</li>;
                                })}
                            </ul>
                        </h3>
                        <h3>
                            Diet specifications:{" "}
                            <ul>
                                {response.dietLabels.map((item, i) => {
                                    return <li key={i}>{item}</li>;
                                })}
                            </ul>
                        </h3>
                    </div>
                    <div>
                        <h3>
                            Dairyfree:{" "}
                            {response.healthLabels.indexOf("DAIRY_FREE") > -1
                                ? "✅"
                                : "❌"}
                        </h3>
                        <h3>
                            Glutenfree:{" "}
                            {response.healthLabels.indexOf("GLUTEN_FREE") > -1
                                ? "✅"
                                : "❌"}
                        </h3>
                        <h3>
                            Peanutfree:{" "}
                            {response.healthLabels.indexOf("PEANUT_FREE") > -1
                                ? "✅"
                                : "❌"}
                        </h3>
                        <h3>
                            Vegan:{" "}
                            {response.healthLabels.indexOf("VEGAN") > -1
                                ? "✅"
                                : "❌"}
                        </h3>
                        <h3>
                            Vegetarian:{" "}
                            {response.healthLabels.indexOf("VEGETARIAN") > -1
                                ? "✅"
                                : "❌"}
                        </h3>
                    </div>
                    <div>
                        <h3>
                            Carbs:{" "}
                            {Math.round(
                                response.totalNutrients.CHOCDF.quantity
                            )}{" "}
                            g
                        </h3>
                        <h3>
                            Fat:{" "}
                            {Math.round(response.totalNutrients.FAT.quantity)} g
                        </h3>
                        <h3>
                            Fibers:{" "}
                            {Math.round(response.totalNutrients.FIBTG.quantity)}{" "}
                            g
                        </h3>
                        <h3>
                            Proteins:{" "}
                            {Math.round(
                                response.totalNutrients.PROCNT.quantity
                            )}{" "}
                            g
                        </h3>
                        <h3>
                            Sugars:{" "}
                            {Math.round(response.totalNutrients.SUGAR.quantity)}{" "}
                            g
                        </h3>
                        <h3>
                            Vitamin C:{" "}
                            {Math.round(response.totalNutrients.VITC.quantity)}{" "}
                            g
                        </h3>
                    </div>
                </div>
            )}
        </div>
    );
}
