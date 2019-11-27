import React, { Component } from "react";

import LoginBox from './LoginBox.jsx';
import LoggedInBox from './LoggedInBox.jsx';
import Welcome from './Welcome.jsx';

class PageRoot extends Component {
    constructor(props) {
        super(props);
        this.state = { loaded: false };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                loaded: true,
                user: user
            });
        });
    }

    componentWillUnmount() {
        firebase.auth().off();
    }

    render() {
        const { loaded, user } = this.state;

        return (
            <div>
                <Welcome/>
                {!loaded ? (
                    'Loading...'
                ) : user ? (
                    <LoggedInBox user={user}/>
                ) : (
                    <LoginBox/>
                )}
            </div>
        )
    }
}

export default PageRoot;
