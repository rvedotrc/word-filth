import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LanguageSelector from './language_selector';
import {VocabEntryType} from "../../words/CustomVocab/types";
import {startAddVocab} from "lib/app_context";

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
} & WithTranslation

const signOut = () => firebase.auth().signOut();

const LoginBar = (props: Props) => {
    const { t, user } = props;

    return (
        <div id={'LoginBar'}>
            {t('login_bar.logged_in_as.label')}
            {' '}
            <b>{user.displayName}</b>
            {' '}
            <button onClick={signOut}>{t('login_bar.log_out.label')}</button>
            {' '}
            <LanguageSelector user={user}/>
            {' '}
            {
                [
                    'substantiv',
                    'verbum',
                    'adjektiv',
                    'udtryk',
                ].map((type: VocabEntryType) => (
                    <span
                        key={type}
                        className="addVocabShortCut"
                        role="button"
                        onClick={() => startAddVocab(type)}
                    >
                        {t(`login_bar.shortcut.add.${type}`)}
                    </span>
                ))
            }
        </div>
    );
};

export default withTranslation()(LoginBar);
