import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import PropTypes from 'prop-types';

class LanguageInput extends Component {

    constructor(props) {
        super(props);

        let lang = props.value;
        if (props.allowedValues.indexOf(lang) < 0) {
            lang = props.allowedValues[0];
        }

        this.state = { value: lang };
    }

    onChange(e) {
        let v = e.target.value;
        this.props.onChange(v);
    }

    render() {
        const { t } = this.props;

        return (
            <select
                onChange={e => this.onChange(e)}
                value={this.state.value}
                autoFocus={this.props.autoFocus}
                data-test-id={this.props['data-test-id']}
                ref={this.props.inputRef}
            >
                {this.props.allowedValues.map(lang => (
                    <option
                        key={lang}
                        value={lang}
                    >
                        {t('settings.language.' + lang)}
                    </option>
                ))}
            </select>
        )
    }

}

LanguageInput.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    autoFocus: PropTypes.bool.isRequired,
    "data-test-id": PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    allowedValues: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    value: PropTypes.string,
    inputRef: PropTypes.object,
};

export default withTranslation()(LanguageInput);
