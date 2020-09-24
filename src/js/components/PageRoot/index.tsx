import * as React from 'react';

import LoginBox from '../LoginBox';
import LoggedInBox from '../LoggedInBox';
import DataMigrator from './data_migrator';
import {useEffect, useState} from "react";
import {currentUser} from "lib/app_context";

declare const firebase: typeof import('firebase');

const PageRoot = () => {
    const [user, setUser] = useState<firebase.User | null>(currentUser.getValue());

    useEffect(() => currentUser.observe(newUser => {
        setUser(newUser);
        if (newUser) {
            new DataMigrator(firebase.database().ref(`users/${newUser.uid}`)).migrate();
        }
    }), []);

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
