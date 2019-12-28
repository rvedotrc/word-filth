import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

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
                    <button onClick={this.signInWithGoogle}>{t('login_bar.log_in.label')}</button>
                )}
                {user && (
                    <div>
                        <span>
                            {t('login_bar.logged_in_as.label')}
                            {' '}
                            <b>{this.props.user.displayName}</b>
                        </span>
                        {' '}
                        <button onClick={this.signOut}>{t('login_bar.log_out.label')}</button>
                    </div>
                )}
            </div>
        )
    }
}

LoginBar.propTypes = {
    user: PropTypes.object
};

LoginBar.defaultProps = {
    user: null
};

export default withTranslation()(LoginBar);
