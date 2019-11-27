import React, { Component } from "react";

import LoginBar from "../LoginBar";
import Welcome from "../Welcome";

class LoginBox extends Component {
    render() {
        return (
            <div>
                <LoginBar/>
                <Welcome/>
            </div>
        )
    }
}

export default LoginBox;
