import React, { useState, useEffect } from "react";
import axios from "../axios";
export default function Wishlist(props) {
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        console.log("props: ", props);
    }, []);
    function addToWishlist(title) {
        console.log("title", title);
        axios
            .post("addToWishlist", { title })
            .then((res) => {
                if (res.data.success) {
                    setSuccess(
                        <h3 className="success">
                            This recipe has been added to your wishlist!
                        </h3>
                    );
                } else {
                    setSuccess(
                        <h3 className="error">
                            Sorry we have a problem with our database!
                        </h3>
                    );
                }
            })
            .catch((error) => {
                console.log("error in adding wishlist", error);
            });
    }
    return (
        <div className="wishlist">
            <button onClick={() => addToWishlist(props.props)}>
                add to wishlist
            </button>
            {success && success}
        </div>
    );
}
