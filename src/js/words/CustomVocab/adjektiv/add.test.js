import React from "react";
import i18n from "../../../../i18n";
import {mount} from "enzyme/build";

import AddAdjektiv from './add';

describe(AddAdjektiv, () => {

    const dbref = {};
    const onCancel = jest.fn();
    let wrapper;

    beforeEach(() => {
        const form = React.createElement(
            AddAdjektiv,
            {
                t: i18n.t,
                i18n: i18n,
                dbref: dbref,
                onCancel: onCancel,
            },
            null
        );

        wrapper = mount(form);
    });

    afterEach(() => {
        onCancel.mockReset();
    });

    const fillIn = (field, value) => {
        wrapper.find('input[data-test-id="' + field + '"]').simulate('change', { target: { value: value }});
    };

    const valueOf = (field) => {
        return wrapper.find('input[data-test-id="' + field + '"]').prop('value');
    };

    const saveEnabled = () => {
        return !wrapper.find('input[type="submit"]').prop('disabled');
    };

    test('renders in initial state', () => {
        expect(wrapper.text()).toContain('Indtast de grund, t- og lang former');
        expect(saveEnabled()).toBe(false);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('only grund form', () => {
        fillIn('grundForm', 'rød');
        expect(saveEnabled()).toBe(false);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + t-form', () => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        expect(saveEnabled()).toBe(false);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + t-form + langForm', () => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        fillIn('langForm', 'røde');
        expect(saveEnabled()).toBe(true);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + t-form + langForm + engelsk', () => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        fillIn('langForm', 'røde');
        fillIn('engelsk', 'red');
        expect(saveEnabled()).toBe(true);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + bøjning', () => {
        fillIn('grundForm', 'rød');
        fillIn('bøjning', '-t, -e');
        expect(valueOf('tForm')).toBe('rødt');
        expect(valueOf('langForm')).toBe('røde');
        expect(saveEnabled()).toBe(true);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + t-form + langForm + engelsk', () => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        fillIn('langForm', 'røde');
        fillIn('engelsk', 'red');

        // TODO: test save (dbref.push().set(item); blank the form; move focus)
        // for save, will need to mock dbref.push().set(item) => promise
        // wrapper.find('form').simulate('submit');

        expect(onCancel).not.toHaveBeenCalled();
    });

    // komparitiv / superlativ

    test('only grund form then cancel', () => {
        fillIn('grundForm', 'rød');
        wrapper.find('form').simulate('reset');
        expect(onCancel).toHaveBeenCalled();
    });

});
