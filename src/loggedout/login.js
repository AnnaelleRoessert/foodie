import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }
    submit() {
        const { email, password } = this.state;
        console.log(email, password);
        axios.post("/login", { email, password }).then(({ data }) => {
            if (data.success) {
                location.replace("/");
            } else {
                this.setState({ error: true });
            }
        });
    }
    render() {
        return (
            <div id="loginForm">
                {this.state.error && (
                    <div className="error">
                        Something went wrong, please fill out the required
                        fields correctly!
                    </div>
                )}
                <input
                    name="email"
                    onChange={(e) => this.handleChange(e)}
                    autoComplete="off"
                />
                <label htmlFor="email">email</label>
                <input
                    name="password"
                    onChange={(e) => this.handleChange(e)}
                    autoComplete="off"
                    type="password"
                />
                <label htmlFor="password">password</label>
                <button onClick={() => this.submit()}>login</button>
                <div>
                    Not a member?
                    <Link to="/">Register</Link>
                </div>
                <div>
                    Forgot password?
                    <Link to="/resetPassword">get a new password</Link>
                </div>
            </div>
        );
    }
}
