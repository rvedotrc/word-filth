import * as React from 'react';

import LoginBar from '../LoginBar/logged_out';
import Welcome from '../Welcome';

const LoginBox = () => (
    <div>
        <LoginBar/>
        <div className="container">
            <Welcome/>
        </div>
    </div>
);

export default LoginBox;
