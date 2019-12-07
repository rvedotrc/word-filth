import React, { Component } from 'react';

import LoginBar from '../LoginBar';
import Welcome from '../Welcome';

class LoginBox extends Component {
    render() {
        return (
            <div>
                <LoginBar/>
                <div className="container">
                    <Welcome/>
                </div>
            </div>
        )
    }
}

export default LoginBox;
