import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LanguageSelector from './language_selector';

declare const firebase: typeof import('firebase');

const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
};

const LoginBar = (props: WithTranslation) => {
    const { t } = props;

    return (
        <div id={'LoginBar'}>
            <button onClick={signInWithGoogle}>
                {t('login_bar.log_in.label')}
            </button>
            {' '}
            <LanguageSelector/>
        </div>
    );
};

export default withTranslation()(LoginBar);
