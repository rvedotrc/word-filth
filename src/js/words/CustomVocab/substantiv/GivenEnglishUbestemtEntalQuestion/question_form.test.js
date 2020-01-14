import {mount} from "enzyme/build";
import i18n from "../../../../../i18n";
import React from "react";

import GivenEnglishUbestemtEntalQuestion from './index';
import QuestionForm from './question_form';

describe(QuestionForm, () => {

    const substantiv_hund = {
        vocabKey: 'xxx',
        køn: 'en',
        ubestemtEntal: 'hund',
        bestemtEntal: 'hunden',
        ubestemtFlertal: 'hunde',
        bestemtFlertal: 'hundene',
        engelsk: 'dog',
    };

    const onResult = jest.fn();
    const onDone = jest.fn();

    let q;
    let wrapper;

    beforeEach(() => {
        q = new GivenEnglishUbestemtEntalQuestion(substantiv_hund);

        const form = q.createQuestionForm({
            key: q.resultsKey,
            t: i18n.t,
            i18n: i18n,
            onResult: onResult,
            onDone: onDone,
        });

        wrapper = mount(form);

        onResult.mockReset();
        onDone.mockReset();
    });

    const fillIn = (field, value) => {
        wrapper.find('input[data-test-id="' + field + '"]').simulate('change', { target: { value: value }});
    };

    const giveCorrectAnswer = () => {
        fillIn('køn', 'en');
        fillIn('ubestemtEntal', 'hund');
        wrapper.find('form').simulate('submit');
    };

    const giveIncorrectAnswer = () => {
        fillIn('køn', 'et');
        fillIn('ubestemtEntal', 'glas');
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

        wrapper.find('input[type="button"]').simulate('click');

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    };

    test('renders', () => {
        // TODO: t
        expect(wrapper.text()).toContain('Hvordan siger man på dansk');
        expect(wrapper.text()).toContain(substantiv_hund.engelsk);
        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    test('submit incomplete form', () => {
        wrapper.find('form').simulate('submit');

        expect(wrapper.text()).toContain('must be filled in');
        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    test('enter correct answer first time', () => {
        giveCorrectAnswer();

        expect(wrapper.text()).toContain('Correct!');
        expect(wrapper.text()).toContain(substantiv_hund.køn + ' ' + substantiv_hund.ubestemtEntal);
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
        expect(wrapper.text()).toContain(substantiv_hund.køn + ' ' + substantiv_hund.ubestemtEntal);
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

        expect(wrapper.text()).toContain('You answered: et glas');
        expect(wrapper.text()).toContain('But it was actually: en hund');
        giveUpCheck();
    });

    test('give up without answering', () => {
        giveUp();

        expect(wrapper.text()).toContain('You answered:'); // add '-' ?
        expect(wrapper.text()).toContain('But it was actually: en hund');
        giveUpCheck();
    });

    // TODO: multiple english answers?
    // - any accepted as correct
    // - show all on praise
    // - show all on give up

});

