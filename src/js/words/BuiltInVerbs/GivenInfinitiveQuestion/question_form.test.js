import GivenInfinitiveQuestion from './index';
import QuestionForm from './question_form';
import {mount} from "enzyme/build";
import i18n from "../../../../i18n";
import React from "react";

describe(QuestionForm, () => {

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

        const form = q.createQuestionForm({
            key: q.resultsKey,
            t: i18n.t,
            i18n: i18n,
            onResult: onResult,
            onDone: onDone,
        });

        wrapper = mount(form);
    });

    afterEach(() => {
        onResult.mockReset();
        onDone.mockReset();
    });

    const fillIn = (field, value) => {
        wrapper.find('input[data-test-id="' + field + '"]').simulate('change', { target: { value: value }});
    };

    const giveCorrectAnswer = () => {
        fillIn('nutid', 'ser');
        fillIn('datid', 'så');
        fillIn('førnutid', 'set');
        wrapper.find('form').simulate('submit');
    };

    const giveIncorrectAnswer = () => {
        fillIn('nutid', 'xxx');
        fillIn('datid', 'yyy');
        fillIn('førnutid', 'zzz');
        wrapper.find('form').simulate('submit');
    };

    const acceptPraise = () => {
        wrapper.find('input[type="button"]').simulate('click');
    };

    const giveUp = () => {
        wrapper.find('form').simulate('reset');
    };

    const giveUpCheck = () => {
        expect(onResult).toHaveBeenCalledWith(false);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        wrapper.find('button').simulate('click');

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    };

    test('renders', () => {
        // TODO: t
        expect(wrapper.text()).toContain('Hvordan dannes verbet');
        expect(wrapper.text()).toContain(q.infinitive);
        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    test('submit incomplete form', () => {
        wrapper.find('form').simulate('submit');

        // TODO: t
        expect(wrapper.text()).toContain('skal udfyldes');
        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    test('enter correct answer first time', () => {
        giveCorrectAnswer();

        expect(wrapper.text()).toContain('Correct!');
        expect(wrapper.text()).toContain('ser, så, set');
        expect(onResult).toHaveBeenCalledWith(true);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        acceptPraise();

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    });

    test('enter incorrect answer first time, then correct answer', () => {
        giveIncorrectAnswer();

        expect(onResult).toHaveBeenCalledWith(false);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        giveCorrectAnswer();

        expect(wrapper.text()).toContain('Correct!');
        expect(wrapper.text()).toContain('ser, så, set');
        expect(onResult).toHaveBeenCalledWith(true);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        acceptPraise();

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    });

    test('enter incorrect answer first time, then give up', () => {
        giveIncorrectAnswer();

        expect(onResult).toHaveBeenCalledWith(false);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        giveUp();

        // TODO: t
        expect(wrapper.text()).toContain('Du svarede: xxx, yyy, zzz');
        expect(wrapper.text()).toContain('Det var faktisk: ser, så, set');
        giveUpCheck();
    });

    test('give up without answering', () => {
        giveUp();

        // TODO: t
        expect(wrapper.text()).toContain('Du svarede: -');
        expect(wrapper.text()).toContain('Det var faktisk: ser, så, set');
        giveUpCheck();
    });

    // TODO: multiple forms within a verb
    // - any accepted as correct
    // - show all on praise
    // - show all on give up

    // TODO: multiple verbs
    // - any accepted as correct
    // - show all on praise
    // - show all on give up

});
