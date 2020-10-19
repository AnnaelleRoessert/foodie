import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "./axios";
import Nav from "./loggedin/nav";
import Recipes from "./loggedin/recipes";
import FilterRecipes from "./loggedin/filter";

export default function App() {
    const [userProfile, setUserProfile] = useState();
    const [error, setError] = useState();
    const [changeProfile, setProfileChanges] = useState(false);

    useEffect(() => {
        console.log("ProfilePic has mounted");
        (async () => {
            try {
                const { data } = await axios.get("/userProfile");
                console.log("data userProfile: ", data);
                if (data.error) {
                    setError(data.error);
                } else {
                    setUserProfile(data);
                }
            } catch (error) {
                console.log("error in getting userProfile", error);
            }
        })();
    }, []);
    // stuff to handle profile changes
    function modifyProfile() {
        setProfileChanges(true);
    }
    function handleChange({ target }) {
        const image = target.files[0];
        console.log("targetname", target.value);
        let formData = new FormData();
        formData.append("file", image);
        axios
            .post("/modifyProfile", formData)
            .then(({ data }) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    console.log("modifiedProfile: ", data);
                    setUserProfile(data);
                }
            })
            .catch((error) => console.log("error in getting new image", error));
    }
    function closeChangeProfile() {
        setProfileChanges(false);
    }

    return (
        <React.Fragment>
            <header>
                <h1 className="foodie">FOODIE.</h1>
                {userProfile && (
                    <img
                        onClick={modifyProfile}
                        id="profilepic"
                        src={
                            userProfile.image_url ||
                            "/otherpictures/defaultPic.png"
                        }
                    />
                )}
            </header>
            <main>
                <div id="appMain">
                    {error && <h3 className="error">{error}</h3>}
                    {/* modal */}
                    {changeProfile && (
                        <div id="modifyprofilemodal">
                            <div id="x" onClick={closeChangeProfile}>
                                X
                            </div>
                            <h3>Want to update your profile?</h3>
                            <br></br>
                            <input
                                onChange={(e) => handleChange(e)}
                                type="file"
                                name="file"
                                accept="image/*"
                            />
                            {/* check useSteforfields in custom hooks */}
                        </div>
                    )}
                    {/* modal end */}
                </div>
                <BrowserRouter>
                    <div>
                        <Route exact path="/" component={Nav} />
                        <Route exact path="/recipes" component={Recipes} />
                        <Route
                            exact
                            path="/filterrecipes"
                            component={FilterRecipes}
                        />
                        {/* <Route exact path="/profile" component={Profile} /> */}
                    </div>
                </BrowserRouter>
            </main>
            <footer>
                <p>ⓒ Miss Elle</p>
                <a href="/logout">
                    <button className="navbutton">logout</button>
                </a>
            </footer>
        </React.Fragment>
    );
}
