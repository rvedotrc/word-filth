import * as React from 'react';

import LoginBar from '../LoginBar/logged_out';
import Welcome from '../Welcome';

const LoginBox = () => (
    <>
        <LoginBar/>
        <div>
            <Welcome/>
        </div>
    </>
);

export default LoginBox;
