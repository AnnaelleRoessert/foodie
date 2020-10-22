import React, { useState } from "react";
import axios from "../axios";
import Email from "./email";

export default function Heart() {
    const [wishlist, setWishlist] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [emailVisible, setEmailVisible] = useState(false);
    const [desiredRecipe, setRecipe] = useState();
    function getWishlist() {
        setModalVisible(true);
        axios
            .get("/wishlist")
            .then((res) => {
                console.log("resdata", res.data);
                setWishlist(res.data);
            })
            .catch((error) => {
                console.log("error in getting wishlist", error);
            });
    }
    function closeHeart() {
        setModalVisible(false);
    }
    function showEmail(title) {
        setEmailVisible(true);
        setRecipe(title);
    }
    return (
        <React.Fragment>
            <div onClick={getWishlist} id="heart">
                🤍
            </div>
            {modalVisible && (
                <div id="heartmodal">
                    <p id="heartX" onClick={closeHeart}>
                        X
                    </p>
                    <h3 id="wishlistheader">💚 WISHLIST 💚</h3>
                    <ul>
                        {wishlist &&
                            wishlist.map((item, i) => {
                                return (
                                    <li key={i}>
                                        {item.recipe_title}{" "}
                                        <p
                                            onClick={() =>
                                                showEmail(item.recipe_title)
                                            }
                                            id="mail"
                                        >
                                            📧
                                        </p>
                                    </li>
                                );
                            })}
                        <br></br>
                        <div id="emailcontainer">
                            {emailVisible && <Email props={desiredRecipe} />}
                        </div>
                    </ul>
                </div>
            )}
        </React.Fragment>
    );
}
