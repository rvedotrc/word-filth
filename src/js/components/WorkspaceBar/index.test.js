import React from 'react';
import {mount} from 'enzyme';
import i18n from "../../../i18n";

import WorkspaceBar from './index';

describe(WorkspaceBar, () => {

    test('renders', () => {
        const onSwitch = () => {};

        i18n.changeLanguage('en');
        const wrapper = mount(
            <WorkspaceBar i18n={i18n} t={i18n.t} onSwitchTab={onSwitch}/>
        );

        expect(wrapper.find('button')).toHaveLength(7);
    });

});
