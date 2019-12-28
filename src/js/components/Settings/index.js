import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class Settings extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/settings`);
        ref.on('value', snapshot => this.setState({ data: snapshot.val() || {} }));
        this.setState({ ref: ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    toggle(name) {
        const newRef = this.state.ref.child(name);
        newRef.set(!this.state.data[name]);
    }

    setLanguage(e) {
        this.props.i18n.changeLanguage(e.target.value);
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
                    <select onChange={e => this.setLanguage(e)}>
                        {['en', 'da', 'no'].map(lang => (
                            <option
                                value={lang}
                                selected={i18n.language === lang}
                            >
                                {t('settings.language.' + lang)}
                            </option>
                        ))}
                    </select>
                </p>
            </div>
        );
    }
}

Settings.propTypes = {
    user: PropTypes.object.isRequired
};

export default withTranslation()(Settings);
