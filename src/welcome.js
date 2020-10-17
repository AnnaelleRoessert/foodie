import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./loggedout/registration";
import Login from "./loggedout/login";
import ResetPassword from "./loggedout/resetPassword";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1 className="foodie">FOODIE.</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetPassword" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
