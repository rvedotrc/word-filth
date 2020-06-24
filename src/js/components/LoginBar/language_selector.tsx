import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./language_selector.css');

declare const firebase: typeof import('firebase');

type Props = {
    user?: firebase.User;
} & WithTranslation

class LanguageSelector extends React.Component<Props, never> {

    setLanguage(lang: string) {
        this.props.i18n.changeLanguage(lang);

        if (this.props.user) {
            const ref = firebase.database().ref(`users/${this.props.user.uid}/settings`);
            ref.child('language').set(lang, (error) => {
                if (error) console.error("store language error", error);
            });
        }
    }

    render() {
        const languages = [
            { code: 'en', icon: "&#x1F1EC;&#x1F1E7;" },
            { code: 'da', icon: "&#x1F1E9;&#x1F1F0;" },
            { code: 'no', icon: "&#x1F1F3;&#x1F1F4;" },
        ];

        return (
            <span>
                {languages.map(lang => (
                    <a
                        key={lang.code}
                        className={[
                            styles.icon,
                            (lang.code === this.props.i18n.language) ? styles.iconselected : styles.iconunselected,
                        ].join(' ')}
                        href='#'
                        onClick={(e) => { this.setLanguage(lang.code); e.preventDefault(); }}
                        dangerouslySetInnerHTML={{__html: lang.icon}}
                    />
                ))}
            </span>
        )
    }
}

export default withTranslation()(LanguageSelector);
