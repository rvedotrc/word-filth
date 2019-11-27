import React, { Component } from "react";

import Welcome from "../Welcome";

class LoginBox extends Component {
    signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    render() {
        return (
            <div id={'LoginBox'}>
                <Welcome/>

                <h2>Log på</h2>
                <button onClick={this.signInWithGoogle}>Log på med Google</button>
            </div>
        )
    }
}

export default LoginBox;
