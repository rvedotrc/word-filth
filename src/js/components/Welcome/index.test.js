import React from 'react';
import { I18nextProvider } from "react-i18next";
import renderer from 'react-test-renderer';
import i18n from "../../../i18n";

import Welcome from './index';

describe(Welcome, () => {

    test('renders', () => {
        i18n.changeLanguage('da');
        // eslint-disable-next-line no-unused-vars
        const component = renderer.create(
            <I18nextProvider i18n={i18n}>
                <Welcome/>
            </I18nextProvider>
        );
    });

});
