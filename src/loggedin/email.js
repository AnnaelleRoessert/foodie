import React, { useState, useEffect } from "react";
import axios from "../axios";
export default function Email(props) {
    const [email, setEmail] = useState();
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);

    useEffect(() => {
        console.log("props: ", props);
    }, []);

    function getEmail({ target }) {
        setEmail(target.value);
    }

    function sendEmail() {
        const title = props.props;
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
            <h3 id="sendrecipe">
                Send recipe via mail to:{" "}
                <input onChange={(e) => getEmail(e)}></input>
                <br></br>
                <button onClick={sendEmail}>send</button>
                {success && <p>The recipe has been sent! Enjoy your meal!</p>}
                {fail && (
                    <p className="error">Please enter a valid email address!</p>
                )}
            </h3>
        </div>
    );
}
