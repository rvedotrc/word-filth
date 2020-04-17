import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from "prop-types";

class Welcome extends Component {

    render() {
        const { t } = this.props;

        return (
            <div>
                <h2 id="welcomeHeader">{t('welcome.header')}</h2>
                <h1>Word Filth</h1>
                <p>{t('welcome.para_1')}</p>
                <p>{t('welcome.para_2')}</p>
            </div>
        )
    }

}

Welcome.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
};

export default withTranslation()(Welcome);
