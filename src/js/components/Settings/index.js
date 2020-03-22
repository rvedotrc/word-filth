import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import LanguageInput from "../shared/language_input";

class Settings extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/settings`);
        ref.on('value', snapshot => this.setState({ data: snapshot.val() || {} }));
        this.setState({ ref });

        // FIXME: Why is this necessary?
        const me = this;
        let languageListener = lang => {
            console.log("language has changed to", lang);
            me.forceUpdate();
        };
        this.setState({ languageListener });
        this.props.i18n.on('languageChanged', languageListener);
    }

    componentWillUnmount() {
        const { ref, languageListener } = this.state;
        if (ref) ref.off();
        if (languageListener) this.props.i18n.off('languageChanged', languageListener);
    }

    toggle(name) {
        const newRef = this.state.ref.child(name);
        newRef.set(!this.state.data[name]);
    }

    setLanguage(lang) {
        this.props.i18n.changeLanguage(lang);
        this.state.ref.child('language').set(lang, (error) => {
            if (error) console.log("store language error", error);
        });
    }

    render() {
        if (!this.state) return null;
        const { data } = this.state;
        if (!data) return null;

        const { t, i18n } = this.props;

        return (
            <div>
                <h1>{t('settings.header')}</h1>

                <p>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!data.deactivateBuiltinVerbs}
                            onChange={() => this.toggle('deactivateBuiltinVerbs')}
                        />
                        {t('settings.disable_builtin_verbs.label')}
                    </label>
                </p>

                <p>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!data.activateBabbel}
                            onChange={() => this.toggle('activateBabbel')}
                        />
                        {t('settings.enable_babbel.label')}
                    </label>
                </p>

                <h2>{t('settings.language.header')}</h2>
                <p>
                    <LanguageInput
                        key={new Date().toString()} // FIXME: Why is this needed?
                        autoFocus={false}
                        data-test-id={"ui-language"}
                        onChange={lang => this.setLanguage(lang)}
                        allowedValues={['en', 'da', 'no']}
                        value={i18n.language}
                    />
                </p>
            </div>
        );
    }
}

Settings.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default withTranslation()(Settings);
