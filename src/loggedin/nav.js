import React from "react";
export default function Nav() {
    return (
        <div id="appMain">
            <a href="/recipes">
                <div className="appMenu" id="nav1">
                    <h1 className="appMenuHeader">See all recipes</h1>
                </div>
            </a>
            <a href="/filterrecipes">
                <div className="appMenu" id="nav2">
                    <h1 className="appMenuHeader">Find Favs</h1>
                </div>
            </a>
            <a href="/community">
                <div className="appMenu" id="nav3">
                    <h1 className="appMenuHeader">Community</h1>
                </div>
            </a>
        </div>
    );
}
