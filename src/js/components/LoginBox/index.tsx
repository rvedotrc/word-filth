import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import LoginBar from '../LoginBar';
import Welcome from '../Welcome';

class LoginBox extends React.Component<WithTranslation, {}> {
    render() {
        return (
            <div>
                <LoginBar onAddVocab={() => null}/>
                <div className="container">
                    <Welcome/>
                </div>
            </div>
        )
    }
}

export default withTranslation()(LoginBox);
