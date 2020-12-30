import * as React from 'react';

import LoggedOutBox from '../LoggedOutBox';
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
                <LoggedOutBox/>
            )}
        </div>
    );
};

export default PageRoot;
