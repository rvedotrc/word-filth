import React, { Component } from "react";
import PropTypes from "prop-types";

import Workspace from './Workspace.jsx';

class LoggedInBox extends Component {
    signOut() {
        firebase.auth().signOut().catch(function(error) {
            // An error happened.
            console.log(error);
        });
    }

    render() {
        return (
            <div id={'LoggedInBox'}>
                <h2>Logget på</h2>
                <p>Du er logget på som: {this.props.user.displayName}</p>
                <button onClick={this.signOut}>Log af</button>

                <Workspace user={this.props.user}/>
            </div>
        )
    }
}

LoggedInBox.propTypes = {
    user: PropTypes.object.isRequired
};

export default LoggedInBox;
