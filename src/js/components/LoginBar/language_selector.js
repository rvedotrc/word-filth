import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import styles from './language_selector.css';
import PropTypes from "prop-types";

class LanguageSelector extends Component {

    setLanguage(lang) {
        this.props.i18n.changeLanguage(lang);

        if (this.props.user) {
            const ref = firebase.database().ref(`users/${this.props.user.uid}/settings`);
            ref.child('language').set(lang, (error) => {
                console.log("set language error", error);
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

LanguageSelector.propTypes = {
    user: PropTypes.object
};

LanguageSelector.defaultProps = {
    user: null
};

export default withTranslation()(LanguageSelector);
