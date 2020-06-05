import * as React from 'react';
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n-setup";
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

import Welcome from './index';

describe(Welcome, () => {

    test('renders', () => {
        i18n.changeLanguage('da');
        // eslint-disable-next-line no-unused-vars
        const component = render(
            <I18nextProvider i18n={i18n}>
                <Welcome/>
            </I18nextProvider>
        );
        console.log({ screen });
    });

});
