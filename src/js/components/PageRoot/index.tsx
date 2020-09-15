import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LoginBox from '../LoginBox';
import LoggedInBox from '../LoggedInBox';
import DataMigrator from './data_migrator';
import * as AppContext from 'lib/app_context';
import {CallbackRemover} from "lib/observer";

declare const firebase: typeof import('firebase');

type State = {
    loaded: boolean;
    user: firebase.User | null;
    userUnsubscriber?: CallbackRemover;
}

class PageRoot extends React.Component<WithTranslation, State> {
    constructor(props: WithTranslation) {
        super(props);
        this.state = { loaded: false, user: null };
    }

    componentDidMount() {
        const userUnsubscriber = AppContext.currentUser.observe(user => {
            this.setState({
                loaded: true,
                user: user,
            });

            if (user) {
                new DataMigrator(firebase.database().ref(`users/${user.uid}`)).migrate();
            }
        });

        this.setState({ userUnsubscriber });
    }

    componentWillUnmount() {
        this.state?.userUnsubscriber?.();
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

