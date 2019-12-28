import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class LanguageSelector extends Component {
    render() {
        const { i18n, t } = this.props;

        const languages = [
            { code: 'en', icon: "&#x1F1EC;&#x1F1E7;" },
            { code: 'da', icon: "&#x1F1E9;&#x1F1F0;" },
            { code: 'no', icon: "&#x1F1F3;&#x1F1F4;" },
        ];

        // FIXME: highlight-current not working
        languages.map(lang => lang.is_current = (i18n.language === lang.code));

        return (
            <span>
                {languages.map(lang => (
                    <a
                        key={lang.code}
                        style={{
                            marginLeft: '0.5em',
                            marginRight: '0.5em',
                            border: (lang.is_current ? "0.1em solid grey" : "0.1em solid tranparent"),
                            textDecoration: 'none',
                        }}
                        href='#'
                        onClick={(e) => { this.props.i18n.changeLanguage(lang.code); e.preventDefault(); }}
                        dangerouslySetInnerHTML={{__html: lang.icon}}
                    />
                ))}
            </span>
        )
    }
}

export default withTranslation()(LanguageSelector);
