import React, { useState, useEffect } from "react";
import axios from "../axios";
//get props from app as username value
export default function Imageboard() {
    useEffect(() => {
        console.log("Imageboard just mounted");
        //get all images from database step 2
    }, []);
    // handle image and data upload ---->server step 1
    return (
        <div id="imageboardmain">
            <h1>Share your meals with us!</h1>
            <div id="uploader">
                <input type="text" name="title" placeholder="title"></input>
                <input
                    type="text"
                    name="description"
                    placeholder="description"
                ></input>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                ></input>
                <input
                    type="file"
                    name="file"
                    className="inputfile"
                    accept="image/*"
                ></input>

                <label id="file" htmlFor="file">
                    Choose a file!
                </label>
                <br></br>
                <button>upload</button>
            </div>
            <div id="imageboard">
                <img
                    id="imageboardimage"
                    src="/otherpictures/defaultPic.png"
                ></img>
            </div>
        </div>
    );
}
