import * as React from 'react';
import {render, waitFor} from '@testing-library/react'

import i18n from "../../../i18n-setup";

import WorkspaceBar from './index';

describe(WorkspaceBar, () => {

    test('renders', async () => {
        const onSwitch = () => {};

        i18n.changeLanguage('en');
        const component = render(
            <WorkspaceBar i18n={i18n} onSwitchTab={onSwitch}/>
        );

        await waitFor(() =>
            expect(component.container.querySelectorAll('button')).toHaveLength(6)
        );
    });

});
