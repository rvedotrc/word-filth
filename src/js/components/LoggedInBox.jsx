import React, { Component } from "react";
import PropTypes from "prop-types";

class LoggedInBox extends Component {
    signOut() {
        firebase.auth().signOut().catch(function(error) {
            // An error happened.
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                <h2>Signed in</h2>
                <p>You are signed in as: {this.props.user.displayName}</p>
                <button onClick={this.signOut}>Sign out</button>
            </div>
        )
    }
}

LoggedInBox.propTypes = {
    user: PropTypes.object.isRequired
};

export default LoggedInBox;
