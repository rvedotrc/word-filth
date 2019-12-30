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
            if (this.state.ref) this.state.ref.off();

            this.setState({
                loaded: true,
                user: user,
                ref: null,
            });

            const { i18n } = this.props;

            // Restore language on login; default to english
            if (user) {
                const ref = firebase.database().ref(`users/${user.uid}/settings/language`);
                ref.once('value').then(snapshot => {
                    i18n.changeLanguage(snapshot.val() || 'en');
                });
            } else {
                i18n.changeLanguage('en');
            }
        });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
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

