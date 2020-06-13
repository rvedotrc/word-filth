import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LoginBox from '../LoginBox';
import LoggedInBox from '../LoggedInBox';

import DataMigrator from './data_migrator';

declare const firebase: typeof import('firebase');

type State = {
    loaded: boolean;
    user: firebase.User | null;
    unsubscribe?: () => void;
}

class PageRoot extends React.Component<WithTranslation, State> {
    constructor(props: WithTranslation) {
        super(props);
        this.state = { loaded: false, user: null };
    }

    componentDidMount() {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {

            this.setState({
                loaded: true,
                user: user,
            });

            const { i18n } = this.props;

            // Restore language on login; default to english
            if (user) {
                firebase.database().ref(`users/${user.uid}/settings/language`)
                    .once('value').then(snapshot => {
                        // FIXME: default settings
                        i18n.changeLanguage(snapshot.val() || 'en');
                    });

                new DataMigrator(firebase.database().ref(`users/${user.uid}`)).migrate();
            } else {
                i18n.changeLanguage('en');
            }
        });

        this.setState({ unsubscribe });
    }

    componentWillUnmount() {
        this.state?.unsubscribe?.();
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

