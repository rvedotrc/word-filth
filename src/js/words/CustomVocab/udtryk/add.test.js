import React from "react";
import i18n from "../../../../i18n-setup";
import {mount} from "enzyme/build";

import AddUdtryk from './add';

describe(AddUdtryk, () => {

    const dbref = {};
    const onCancel = jest.fn();
    const onSearch = jest.fn();
    let wrapper;

    beforeEach(() => {
        const form = React.createElement(
            AddUdtryk,
            {
                t: i18n.t,
                i18n: i18n,
                dbref: dbref,
                onCancel: onCancel,
                onSearch: onSearch,
                vocabLanguage: 'no',
            },
            null
        );

        wrapper = mount(form);
    });

    afterEach(() => {
        onCancel.mockReset();
        onSearch.mockReset();
    });

    const fillIn = (field, value) => {
        wrapper.find('input[data-testid="' + field + '"]').simulate('change', { target: { value: value }});
    };

    const valueOf = (field) => {
        return wrapper.find('input[data-testid="' + field + '"]').prop('value');
    };

    const saveEnabled = () => {
        return !wrapper.find('input[type="submit"]').prop('disabled');
    };

    test('renders in initial state', () => {
        expect(wrapper.text()).toContain('In Word Filth a phrase has');
        expect(saveEnabled()).toBe(false);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('only Danish', () => {
        fillIn('dansk', 'at have det sjovt');
        expect(saveEnabled()).toBe(false);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('only English', () => {
        fillIn('engelsk', 'to have fun');
        expect(saveEnabled()).toBe(false);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('both Danish and English', () => {
        fillIn('dansk', 'at have det sjovt');
        fillIn('engelsk', 'to have fun');
        expect(saveEnabled()).toBe(true);
        expect(onCancel).not.toHaveBeenCalled();
    });

    const submitAndExpectSave = (done, expectedItem) => {
        const savedItems = [];
        dbref.push = () => ({
            set: item => {
                savedItems.push(item);
                return Promise.resolve(true);
            }
        });

        wrapper.find('form').simulate('submit');

        // FIXME: interval hack
        setTimeout(() => {
            expect(savedItems).toStrictEqual([expectedItem]);

            wrapper.update();
            expect(valueOf('dansk')).toBe('');
            expect(valueOf('engelsk')).toBe('');

            expect(onCancel).not.toHaveBeenCalled();

            done();
        }, 10);
    };

    test('both danish and english, submit', (done) => {
        fillIn('dansk', 'at have det sjovt');
        fillIn('engelsk', 'to have fun');

        submitAndExpectSave(done, {
            lang: 'no',
            type: 'udtryk',
            dansk: 'at have det sjovt',
            engelsk: 'to have fun',
        });
    });

    test('only dansk then cancel', () => {
        fillIn('dansk', 'at have det sjovt');
        wrapper.find('form').simulate('reset');
        expect(onCancel).toHaveBeenCalled();
    });

});
