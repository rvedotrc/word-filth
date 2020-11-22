import * as React from 'react';

import LoginBox from '../LoginBox';
import LoggedInBox from '../LoggedInBox';
import {useEffect, useState} from "react";
import {currentUser} from "lib/app_context";

declare const firebase: typeof import('firebase');

const PageRoot = () => {
    const [user, setUser] = useState<firebase.User | null>(currentUser.getValue());

    useEffect(() => currentUser.observe(setUser), []);

    return (
        <div>
            {user ? (
                <LoggedInBox user={user}/>
            ) : (
                <LoginBox/>
            )}
        </div>
    );
};

export default PageRoot;
