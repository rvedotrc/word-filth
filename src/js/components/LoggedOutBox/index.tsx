import * as React from 'react';

import LoginBar from '../LoginBar/logged_out';
import Workspace from "@components/Workspace";

const LoggedOutBox = () => (
    <div>
        <LoginBar/>
        <Workspace hidden={false}/>
    </div>
);

export default LoggedOutBox;
