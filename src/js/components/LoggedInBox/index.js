import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Workspace from '../Workspace';
import LoginBar from '../LoginBar';

class LoggedInBox extends Component {
    render() {
        return (
            <div>
                <LoginBar user={this.props.user}/>
                <Workspace user={this.props.user}/>
            </div>
        )
    }
}

LoggedInBox.propTypes = {
    user: PropTypes.object.isRequired
};

export default withTranslation()(LoggedInBox);
