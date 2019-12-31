import merge from 'merge';

import GivenInfinitiveQuestion from './index';
import QuestionForm from './question_form';
import Enzyme, {mount} from "enzyme/build";
import Adapter from "enzyme-adapter-react-16/build";
import i18n from "../../../../i18n";
import React from "react";

describe(QuestionForm, () => {

    Enzyme.configure({ adapter: new Adapter() });
    i18n.changeLanguage('en');

    const verb_se = {
        infinitiv: 'at se',
        nutid: ['ser'],
        datid: ['så'],
        førnutid: ['set'],
        engelsk: 'to see',
    };

    const onResult = jest.fn();
    const onDone = jest.fn();

    let q;
    let wrapper;

    beforeEach(() => {
        q = new GivenInfinitiveQuestion(verb_se.infinitiv, [verb_se]);
        wrapper = mount(
            <QuestionForm
                i18n={i18n}
                t={i18n.t}
                question={q}
                onResult={onResult}
                onDone={onDone}
            />
        );

        onResult.mockReset();
        onDone.mockReset();
    });

    test('renders', () => {
        expect(wrapper.html()).toContain('Hvordan dannes verbet');
        expect(wrapper.html()).toContain(q.infinitive);

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    test('submit incomplete form', () => {
        wrapper.find('form').simulate('submit');
        expect(wrapper.html()).toContain('skal udfyldes');

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    test('enter correct answer first time', () => {
        wrapper.find('input[data-test-id="nutid"]').simulate('change', { target: { value: 'ser' }});
        wrapper.find('input[data-test-id="datid"]').simulate('change', { target: { value: 'så' }});
        wrapper.find('input[data-test-id="førnutid"]').simulate('change', { target: { value: 'set' }});
        wrapper.find('form').simulate('submit');

        expect(wrapper.text()).toContain('Correct!');
        expect(wrapper.text()).toContain('ser, så, set');
        expect(onResult).toHaveBeenCalledWith(true);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        wrapper.find('input[type="button"]').simulate('click');

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    });

    test('enter incorrect answer first time, then correct answer', () => {
        wrapper.find('input[data-test-id="nutid"]').simulate('change', { target: { value: 'xxx' }});
        wrapper.find('input[data-test-id="datid"]').simulate('change', { target: { value: 'yyy' }});
        wrapper.find('input[data-test-id="førnutid"]').simulate('change', { target: { value: 'zzz' }});
        wrapper.find('form').simulate('submit');

        expect(onResult).toHaveBeenCalledWith(false);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        wrapper.find('input[data-test-id="nutid"]').simulate('change', { target: { value: 'ser' }});
        wrapper.find('input[data-test-id="datid"]').simulate('change', { target: { value: 'så' }});
        wrapper.find('input[data-test-id="førnutid"]').simulate('change', { target: { value: 'set' }});
        wrapper.find('form').simulate('submit');

        expect(wrapper.text()).toContain('Correct!');
        expect(wrapper.text()).toContain('ser, så, set');
        expect(onResult).toHaveBeenCalledWith(true);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        wrapper.find('input[type="button"]').simulate('click');

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    });

    test('enter incorrect answer first time, then give up', () => {
        wrapper.find('input[data-test-id="nutid"]').simulate('change', { target: { value: 'xxx' }});
        wrapper.find('input[data-test-id="datid"]').simulate('change', { target: { value: 'yyy' }});
        wrapper.find('input[data-test-id="førnutid"]').simulate('change', { target: { value: 'zzz' }});
        wrapper.find('form').simulate('submit');

        expect(onResult).toHaveBeenCalledWith(false);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        wrapper.find('form').simulate('reset');

        expect(wrapper.text()).toContain('Du svarede: xxx, yyy, zzz');
        expect(wrapper.text()).toContain('Det var faktisk: ser, så, set');
        expect(onResult).toHaveBeenCalledWith(false);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        wrapper.find('button').simulate('click');

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    });

});
