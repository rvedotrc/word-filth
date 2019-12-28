import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

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
        const { t } = this.props;
        const { loaded, user } = this.state;

        return (
            <div>
                {!loaded ? (
                    <p style={{margin: '1em'}}>{t('root.loading_message')}</p>
                ) : user ? (
                    <LoggedInBox user={user}/>
                ) : (
                    <LoginBox/>
                )}
            </div>
        )
    }
}

export default withTranslation()(PageRoot);

