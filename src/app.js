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
    const [otherInput, setOtherInput] = useState({});
    const [success1, setSuccess1] = useState(false);
    const [fail1, setFail1] = useState(false);
    const [success2, setSuccess2] = useState(false);
    const [fail2, setFail2] = useState(false);

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
    //for imageupload
    function handleChange({ target }) {
        const image = target.files[0];
        let formData = new FormData();
        formData.append("file", image);
        axios
            .post("/modifyImage", formData)
            .then(({ data }) => {
                if (data.error) {
                    setError(data.error);
                    setFail2(true);
                } else {
                    console.log("modifiedProfile: ", data);
                    setUserProfile(data);
                    setSuccess2(true);
                }
            })
            .catch((error) => console.log("error in getting new image", error));
    }
    //for userdata
    function handleChange2(e) {
        e.preventDefault();
        console.log("target: ", e.target.name, e.target.value);
        setOtherInput({ ...otherInput, [e.target.name]: e.target.value });
        console.log("otherInput: ", otherInput);
    }
    //button and to change profile
    function submitChanges() {
        console.log("userProfile", userProfile);
        console.log("otherInput: ", otherInput);
        axios
            .post("/modifyProfile", otherInput)
            .then(({ data }) => {
                if (data.error) {
                    setFail1(true);
                } else if (data.success) {
                    console.log("modifiedProfile: ", data);
                    setSuccess1(true);
                }
            })
            .catch((error) => console.log("error in getting new image", error));
    }
    function closeChangeProfile() {
        setProfileChanges(false);
        setFail1(false);
        setFail2(false);
        setSuccess1(false);
        setSuccess2(false);
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
                            {userProfile && (
                                <React.Fragment>
                                    <input
                                        onChange={(e) => handleChange2(e)}
                                        type="text"
                                        name="first"
                                        defaultValue={userProfile.firstname}
                                    />
                                    <label
                                        className="labelmodify"
                                        htmlFor="first"
                                    >
                                        firstname
                                    </label>
                                    <input
                                        onChange={(e) => handleChange2(e)}
                                        type="text"
                                        name="last"
                                        defaultValue={userProfile.lastname}
                                    />
                                    <label
                                        className="labelmodify"
                                        htmlFor="last"
                                    >
                                        lastname
                                    </label>
                                    <input
                                        onChange={(e) => handleChange2(e)}
                                        type="text"
                                        name="email"
                                        defaultValue={userProfile.email}
                                    />
                                    <label
                                        className="labelmodify"
                                        htmlFor="email"
                                    >
                                        email
                                    </label>
                                    <input
                                        onChange={(e) => handleChange2(e)}
                                        type="password"
                                        name="password"
                                    />
                                    <label
                                        className="labelmodify"
                                        htmlFor="password"
                                    >
                                        password
                                    </label>
                                </React.Fragment>
                            )}
                            <br></br>
                            <button onClick={submitChanges}>
                                save changes
                            </button>
                            <br></br>
                            {success1 && (
                                <p className="success">
                                    Your profile has been updated!
                                </p>
                            )}
                            {fail1 && (
                                <p className="error">
                                    Sorry, there is a problem in the database,
                                    we could´t update your profile!
                                </p>
                            )}
                            <br></br>
                            <h3>Want to update your image?</h3>
                            <br></br>
                            <input
                                onChange={(e) => handleChange(e)}
                                type="file"
                                name="file"
                                accept="image/*"
                            />
                            <br></br>
                            {success2 && (
                                <p className="success">
                                    Your image has been updated!
                                </p>
                            )}
                            {fail2 && (
                                <p className="error">
                                    Sorry, there is a problem in the database,
                                    we could´t update your image!
                                </p>
                            )}
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
