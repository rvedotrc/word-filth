import React from 'react';
import ReactDOM from 'react-dom';

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

import PageRoot from './js/components/PageRoot';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <I18nextProvider i18n={i18n}>
            <PageRoot />
        </I18nextProvider>,
        document.getElementById("react_container")
    );
});
