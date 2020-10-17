import React from "react";
export default function Nav() {
    return (
        <div id="appMain">
            <a href="/recipes">
                <div className="appMenu" id="nav1">
                    <h2 className="appMenuHeader">See all recipes</h2>
                </div>
            </a>
            <a href="">
                <div className="appMenu" id="nav2">
                    <h2 className="appMenuHeader">Find Favs</h2>
                </div>
            </a>
            <a href="">
                <div className="appMenu" id="nav3">
                    <h2 className="appMenuHeader">Fun Stuff</h2>
                </div>
            </a>
        </div>
    );
}
