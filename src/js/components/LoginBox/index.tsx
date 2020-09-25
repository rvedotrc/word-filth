import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LoginBar from '../LoginBar/logged_out';
import Welcome from '../Welcome';

class LoginBox extends React.Component<WithTranslation, never> {
    render() {
        return (
            <div>
                <LoginBar/>
                <div className="container">
                    <Welcome/>
                </div>
            </div>
        )
    }
}

export default withTranslation()(LoginBox);
