import React, { Component } from "react";

class LoginBox extends Component {
    signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    render() {
        return (
            <div>
                <h2>Sign In</h2>
                <button onClick={this.signInWithGoogle}>Sign in with Google</button>
            </div>
        )
    }
}

export default LoginBox;
