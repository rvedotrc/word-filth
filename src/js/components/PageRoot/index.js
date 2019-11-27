import React, { Component } from "react";

import LoginBox from '../LoginBox';
import LoggedInBox from '../LoggedInBox';

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
                {!loaded ? (
                    'Vent venligst...'
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
