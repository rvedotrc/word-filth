import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LanguageSelector from './language_selector';
import {VocabEntryType} from "../../words/CustomVocab/types";

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
    onAddVocab: (type: VocabEntryType) => void;
} & WithTranslation

class LoginBar extends React.Component<Props, never> {
    private signOut() {
        firebase.auth().signOut().catch(function(error) {
            console.error("signOut error", error);
        });
    }

    render() {
        const { t, user } = this.props;

        return (
            <div id={'LoginBar'}>
                {t('login_bar.logged_in_as.label')}
                {' '}
                <b>{user.displayName}</b>
                {' '}
                <button onClick={this.signOut}>{t('login_bar.log_out.label')}</button>
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
                            onClick={() => this.props.onAddVocab(type)}
                        >
                            {t(`login_bar.shortcut.add.${type}`)}
                        </span>
                    ))
                }
            </div>
        )
    }
}

export default withTranslation()(LoginBar);
