import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {SettingsSaver} from "lib/settings";
import * as UILanguage from "lib/ui_language";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./language_selector.css');

declare const firebase: typeof import('firebase');

type Props = {
    user?: firebase.User;
} & WithTranslation

const languages: { code: UILanguage.Type, icon: string; }[] = [
    { code: 'en', icon: "&#x1F1EC;&#x1F1E7;" },
    { code: 'da', icon: "&#x1F1E9;&#x1F1F0;" },
    { code: 'no', icon: "&#x1F1F3;&#x1F1F4;" },
];

const LanguageSelector = (props: Props) => {
    const setLanguage = (lang: UILanguage.Type) => {
        props.i18n.changeLanguage(lang);

        if (props.user) {
            new SettingsSaver(props.user).setUILanguage(lang);
        }
    };

    return (
        <span>
            {languages.map(lang => (
                <a
                    key={lang.code}
                    className={[
                        styles.icon,
                        (lang.code === props.i18n.language)
                            ? styles.iconselected
                            : styles.iconunselected,
                    ].join(' ')}
                    href='#'
                    onClick={(e) => {
                        setLanguage(lang.code);
                        e.preventDefault();
                    }}
                    dangerouslySetInnerHTML={{__html: lang.icon}}
                />
            ))}
        </span>
    );
};

export default withTranslation()(LanguageSelector);
