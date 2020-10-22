import React, { useState, useEffect } from "react";
import axios from "../axios";
//get props from app as username value
export default function Imageboard() {
    //upload
    const [image, setImage] = useState();
    const [values, setValues] = useState();
    const [error, setError] = useState(false);
    //render on screen
    const [imageOnScreen, setImageOnScreen] = useState([]);

    useEffect(() => {
        console.log("Imageboard has mounted");
        axios
            .get("/images")
            .then(function (res) {
                // console.log("res from get/images: ", res);
                if (res.data.error) {
                    setError(
                        <h3 className="error">
                            Sorry but this image is too large!
                        </h3>
                    );
                } else {
                    setImageOnScreen(res.data);
                }
            })
            .catch(function (error) {
                console.log("error in axios get/images:", error);
            });
    }, []);

    //image
    function handleChange(e) {
        setImage(e.target.files[0]);
    }
    //values
    function handleChange2(e) {
        setValues({ ...values, [e.target.name]: e.target.value });
    }
    function uploader() {
        console.log("data:", image, values);
        var formData = new FormData();
        formData.append("values", JSON.stringify(values));
        formData.append("file", image);
        axios
            .post("/imageboardUpload", formData)
            .then((result) => {
                console.log("result", result);
                setImageOnScreen([result.data, ...imageOnScreen]);
            })
            .catch((error) => {
                console.log("error in uploading images", error);
            });
    }
    console.log("imagesonscreen", imageOnScreen);
    return (
        <div id="imageboardmain">
            <h1>Share your meals with us!</h1>
            <div id="uploader">
                <input
                    type="text"
                    name="title"
                    placeholder="title"
                    onChange={(e) => handleChange2(e)}
                ></input>
                <input
                    type="text"
                    name="description"
                    placeholder="description"
                    onChange={(e) => handleChange2(e)}
                ></input>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    onChange={(e) => handleChange2(e)}
                ></input>
                <input
                    onChange={(e) => handleChange(e)}
                    type="file"
                    name="file"
                    id="file"
                    className="inputfile"
                    accept="image/*"
                ></input>

                <label
                    onChange={(e) => handleChange(e)}
                    htmlFor="file"
                    id="file2"
                >
                    Choose a file!
                </label>
                <br></br>
                <button onClick={uploader}>upload</button>
            </div>
            {error && error}
            <div id="imageboard">
                {imageOnScreen &&
                    imageOnScreen.map((item, i) => {
                        return (
                            <div className="card" key={i}>
                                <h3>@{item.username}</h3>
                                <p>
                                    <em>{item.title}</em>
                                </p>
                                <p>{item.description}</p>
                                <img
                                    className="imageboardimage"
                                    src={item.url}
                                ></img>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
