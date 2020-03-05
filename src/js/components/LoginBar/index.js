import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import LanguageSelector from './language_selector';

class LoginBar extends Component {
    signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    signOut() {
        firebase.auth().signOut().catch(function(error) {
            // An error happened.
            console.log(error);
        });
    }

    render() {
        const { t, user } = this.props;

        return (
            <div id={'LoginBar'}>
                {!user && (
                    <span>
                        <button onClick={this.signInWithGoogle}>{t('login_bar.log_in.label')}</button>
                        {' '}
                        <LanguageSelector/>
                    </span>
                )}
                {user && (
                    <span>
                        <span>
                            {t('login_bar.logged_in_as.label')}
                            {' '}
                            <b>{this.props.user.displayName}</b>
                        </span>
                        {' '}
                        <button onClick={this.signOut}>{t('login_bar.log_out.label')}</button>
                        {' '}
                        <LanguageSelector user={user}/>
                    </span>
                )}
            </div>
        )
    }
}

LoginBar.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object
};

LoginBar.defaultProps = {
    user: null
};

export default withTranslation()(LoginBar);
