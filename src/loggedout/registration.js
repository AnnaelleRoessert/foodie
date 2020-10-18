import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
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
        const { first, last, email, password } = this.state;
        // console.log(first, last, email, password);
        axios
            .post("/register", { first, last, email, password })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({ error: true });
                }
            });
    }
    render() {
        return (
            <div id="registrationForm">
                {this.state.error && (
                    <div className="error">
                        Something went wrong, please fill out the required
                        fields correctly!
                    </div>
                )}
                <input
                    name="first"
                    onChange={(e) => this.handleChange(e)}
                    autoComplete="off"
                />
                <label htmlFor="first">firstname</label>
                <input
                    name="last"
                    onChange={(e) => this.handleChange(e)}
                    autoComplete="off"
                />
                <label htmlFor="last">lastname</label>
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
                <button onClick={() => this.submit()}>register</button>
                <div>
                    Not a member?
                    <Link to="/login"> Login</Link>
                </div>
            </div>
        );
    }
}
