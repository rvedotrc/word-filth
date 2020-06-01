import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import Workspace from '../Workspace';
import LoginBar from '../LoginBar';

interface Props extends WithTranslation {
    user: firebase.User;
}

class LoggedInBox extends React.Component<Props, {}> {
    render() {
        return (
            <div>
                <LoginBar user={this.props.user}/>
                <Workspace user={this.props.user}/>
            </div>
        )
    }
}

export default withTranslation()(LoggedInBox);
