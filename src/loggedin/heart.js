import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function Heart() {
    const [wishlist, setWishlist] = useState();
    const [modalVisible, setModalVisible] = useState(false);
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
                    <h3 id="wishlistheader">💚wishlist💚</h3>
                    <ul>
                        {wishlist &&
                            wishlist.map((item, i) => {
                                return <li key={i}>{item.recipe_title}</li>;
                            })}
                    </ul>
                </div>
            )}
        </React.Fragment>
    );
}
