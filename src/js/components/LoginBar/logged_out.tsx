import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LanguageSelector from './language_selector';

declare const firebase: typeof import('firebase');

class LoginBar extends React.Component<WithTranslation, never> {
    private signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    render() {
        const { t } = this.props;

        return (
            <div id={'LoginBar'}>
                <button onClick={this.signInWithGoogle}>{t('login_bar.log_in.label')}</button>
                {' '}
                <LanguageSelector/>
            </div>
        )
    }
}

export default withTranslation()(LoginBar);
