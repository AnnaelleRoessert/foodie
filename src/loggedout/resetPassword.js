import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = { current: 1 };
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }
    submit() {
        const { email } = this.state;
        axios.post("/resetPasswordStep1", { email }).then(({ data }) => {
            console.log(data);
            if (data.success) {
                this.setState({ current: 2 });
            } else {
                this.setState({
                    error: "Please enter a correct email adress!",
                });
            }
        });
    }
    submit2() {
        const { email, code, password } = this.state;
        // console.log(email, code, password);
        axios
            .post("/resetPasswordStep2", { email, code, password })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ current: 3 });
                } else {
                    this.setState({
                        error: "Recheck if you entered a valid code!",
                    });
                }
            });
    }
    render() {
        let elem;
        if (this.state.current == 1) {
            elem = (
                <div className="resetPasswordForm">
                    <h3>Please enter the email with which you registered!</h3>
                    <input
                        name="email"
                        onChange={(e) => this.handleChange(e)}
                        autoComplete="off"
                        key={0}
                    />
                    <label htmlFor="email">email</label>
                    <button onClick={() => this.submit()}>submit</button>
                </div>
            );
        } else if (this.state.current == 2) {
            elem = (
                <div className="resetPasswordForm">
                    <h3>Please enter the code you received!</h3>
                    <input
                        name="code"
                        onChange={(e) => this.handleChange(e)}
                        autoComplete="off"
                        key={1}
                    />
                    <label htmlFor="code">code</label>
                    <h3>Please enter a new password!</h3>
                    <input
                        name="password"
                        onChange={(e) => this.handleChange(e)}
                        autoComplete="off"
                        type="password"
                    />
                    <label htmlFor="password">password</label>

                    <button onClick={() => this.submit2()}>submit</button>
                </div>
            );
        } else {
            elem = (
                <div className="resetPasswordForm">
                    <h3>Success! You changed your password!</h3>
                    <div>
                        You can now
                        <Link to="/login"> login</Link> with your new password!
                    </div>
                </div>
            );
        }
        return (
            <div>
                {this.state.error && (
                    <div className="error">
                        Something went wrong: {this.state.error}
                    </div>
                )}
                {elem}
            </div>
        );
    }
}
