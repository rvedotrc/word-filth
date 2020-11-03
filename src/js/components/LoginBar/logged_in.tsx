import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LanguageSelector from './language_selector';
import {VocabEntryType} from "lib/types/question";
import {startAddVocab} from "lib/app_context";

declare const firebase: typeof import('firebase');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./index.css');

type Props = {
    user: firebase.User;
} & WithTranslation

const signOut = () => firebase.auth().signOut();

const LoginBar = (props: Props) => {
    const { t, user } = props;

    return (
        <div className={styles.LoginBar}>
            <span className={styles.userLabel}>
                {t('login_bar.logged_in_as.label')}
            </span>
            <span className={styles.userName}>
                {user.displayName}
            </span>
            <button className={styles.logout} onClick={signOut}>
                {t('login_bar.log_out.label')}
            </button>
            <span className={styles.languageSelector}>
                <LanguageSelector user={user}/>
            </span>
            <span className={styles.vocabAdders}>
                {
                    [
                        'substantiv',
                        'verbum',
                        'adjektiv',
                        'udtryk',
                    ].map((type: VocabEntryType) => (
                        <span
                            key={type}
                            role="button"
                            onClick={() => startAddVocab(type)}
                            title={t(`login_bar.shortcut.add.${type}.tooltip`)}
                        >
                            {t(`login_bar.shortcut.add.${type}.text`)}
                        </span>
                    ))
                }
            </span>
        </div>
    );
};

export default withTranslation()(LoginBar);
