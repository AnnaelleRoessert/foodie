import React from "react";
// import { BrowserRouter, Route } from "react-router-dom";
// import axios from "./axios";

// i will use react hooks for communication between components or better redux?
export default function App() {
    return (
        <React.Fragment>
            <header>
                {" "}
                <a href="/logout">
                    <button className="navbutton">logout</button>
                </a>
                {/* profile pic */}
            </header>
            <main>
                {/* <BrowserRouter>
                    <div>
                        <Route exact path="/recipes" component={Recipes} />
                        <Route exact path="/filter" component={Filter} />
                        <Route exact path="/profile" component={Profile} />
                    </div>
                </BrowserRouter> */}
            </main>
            <footer>ⓒ Miss Elle</footer>
        </React.Fragment>
    );
}
