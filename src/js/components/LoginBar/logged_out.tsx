import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LanguageSelector from './language_selector';

declare const firebase: typeof import('firebase');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./index.css');

const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
};

const LoginBar = (props: WithTranslation) => {
    const { t } = props;

    return (
        <div className={styles.LoginBar}>
            <button className={styles.login} onClick={signInWithGoogle}>
                {t('login_bar.log_in.label')}
            </button>
            <span className={styles.languageSelector}>
                <LanguageSelector/>
            </span>
        </div>
    );
};

export default withTranslation()(LoginBar);
