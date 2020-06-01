import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LanguageSelector from './language_selector';

declare const firebase: typeof import('firebase');

interface Props extends WithTranslation {
    user?: firebase.User;
}

class LoginBar extends React.Component<Props, {}> {
    signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    signOut() {
        firebase.auth().signOut().catch(function(error) {
            console.log("signOut error", error);
        });
    }

    render() {
        const { t, user } = this.props;

        return (
            <div id={'LoginBar'}>
                {!user && (
                    <span>
                        <button onClick={this.signInWithGoogle}>{t('login_bar.log_in.label')}</button>
                        {' '}
                        <LanguageSelector/>
                    </span>
                )}
                {user && (
                    <span>
                        <span>
                            {t('login_bar.logged_in_as.label')}
                            {' '}
                            <b>{this.props.user.displayName}</b>
                        </span>
                        {' '}
                        <button onClick={this.signOut}>{t('login_bar.log_out.label')}</button>
                        {' '}
                        <LanguageSelector user={user}/>
                    </span>
                )}
            </div>
        )
    }
}

export default withTranslation()(LoginBar);
