import React from 'react';
import ReactDOM from 'react-dom';

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n-setup";

import * as wiring from "lib/app_context/wiring";
import PageRoot from './js/components/PageRoot';

document.addEventListener('DOMContentLoaded', () => {
    // Language for the pre-auth state
    i18n.changeLanguage('en');

    wiring.start(i18n);

    ReactDOM.render(
        <I18nextProvider i18n={i18n}>
            <PageRoot />
        </I18nextProvider>,
        document.getElementById("react_container")
    );
});
