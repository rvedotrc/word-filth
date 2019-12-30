import React from 'react';
import Enzyme, { mount, render, shallow } from 'enzyme';
import i18n from "../../../i18n";

import Adapter from 'enzyme-adapter-react-16';

import WorkspaceBar from './index';

describe(WorkspaceBar, () => {

    test('renders', () => {
        const onSwitch = () => {};

        Enzyme.configure({ adapter: new Adapter() });

        i18n.changeLanguage('en');
        const wrapper = mount(
            <WorkspaceBar i18n={i18n} t={i18n.t} onSwitchTab={onSwitch}/>
        );

        // mount
        expect(wrapper.find('button')).toHaveLength(7);

        // render?
        // console.log(wrapper.html());
        // expect(wrapper('button')).toHaveLength(3);

        // shallow
        // console.log(wrapper.debug());
        // expect(wrapper.find('button')).toHaveLength(3);
    });

});
