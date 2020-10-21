import React, { useEffect } from "react";
import Nutrition from "./nutrition";
import Imageboard from "./imageboard";
export default function Community(username) {
    useEffect(() => {
        console.log("Community has mounted");
        console.log("props: ", username);
    }, []);
    return (
        <React.Fragment>
            <Nutrition />
            <Imageboard />
        </React.Fragment>
    );
}
