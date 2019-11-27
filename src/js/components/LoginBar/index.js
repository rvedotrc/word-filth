import React, { Component } from "react";
import PropTypes from "prop-types";

class LoginBar extends Component {
    signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    signOut() {
        firebase.auth().signOut().catch(function(error) {
            // An error happened.
            console.log(error);
        });
    }

    render() {
        const { user } = this.props;

        return (
            <div id={'LoginBar'}>
                {!user && (
                    <button onClick={this.signInWithGoogle}>Log på med Google</button>
                )}
                {user && (
                    <div>
                        <span>Du er logget på som <b>{this.props.user.displayName}</b></span>
                        &nbsp;
                        <button onClick={this.signOut}>Log af</button>
                    </div>
                )}
            </div>
        )
    }
}

LoginBar.propTypes = {
    user: PropTypes.object
};

LoginBar.defaultProps = {
    user: null
};

export default LoginBar;
