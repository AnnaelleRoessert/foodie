import React, { useState, useEffect } from "react";
import axios from "../axios";
export default function CustomerServiceMail() {
    const [emailtext, setEmailText] = useState();
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);

    useEffect(() => {}, []);

    function getText({ target }) {
        setEmailText(target.value);
    }

    function sendWishes() {
        (async () => {
            const { data } = await axios.post("/sendSuggestions", {
                emailtext,
            });
            if (data.success) {
                console.log("email has been sent");
                setSuccess(true);
                setFail(false);
            } else {
                console.log("enter valid text");
                setFail(true);
                setSuccess(false);
            }
        })();
    }
    return (
        <div>
            <h3 id="sendwishes">
                Give us some inspiration! What ingredients are you missing?{" "}
                <br></br>
                <textarea
                    id="wishbox"
                    placeholder="Tell us your wishes!"
                    onChange={(e) => getText(e)}
                ></textarea>
                <br></br>
                <button onClick={sendWishes}>send</button>
                <br></br>
                {success && (
                    <p className="success">
                        Your suggestions have been sent! Thank you FOODIE.!
                    </p>
                )}
                {fail && (
                    <p className="error">Please enter your suggestions!</p>
                )}
            </h3>
        </div>
    );
}
