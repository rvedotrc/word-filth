import {fireEvent, render, RenderResult, screen} from "@testing-library/react";

import i18n from "../../../../../i18n-setup";

import GivenEnglishUbestemtEntalQuestion from './index';
import QuestionForm from './question_form';
import Question from './index';

describe(QuestionForm, () => {

    const question_hund = new Question({
        lang: 'da',
        engelsk: 'dog',
        answers: [{køn: 'en', ubestemtEntal: 'hund'}],
    });

    const onResult = jest.fn();
    const onGimme = jest.fn();
    const onDone = jest.fn();

    let component: RenderResult;

    beforeEach(() => {
        onResult.mockReset();
        onGimme.mockReset();
        onDone.mockReset();

        const q = new GivenEnglishUbestemtEntalQuestion(question_hund);

        i18n.changeLanguage('en');

        component = render(
            q.createQuestionForm({
                key: q.resultsKey,

                t: i18n.t,
                i18n: i18n,
                tReady: true,

                // TODO test me
                hasGimme: false,
                gimmeUsed: false,

                onResult,
                onGimme,
                onDone,
            })
        );
    });

    const fillIn = async (field: string, value: string) => {
        fireEvent.change(
            await screen.findByTestId(field),
            { target: { value }},
        );
    };

    const selectGender = async (value: string) => {
        fireEvent.change(
            (await component.findByTestId("køn")),
            { target: { value }},
        );
    };

    const giveCorrectAnswer = async () => {
        await selectGender('en');
        await fillIn('ubestemtEntal', 'hund');
        fireEvent.click(await screen.findByText('Answer'));
    };

    const giveIncorrectAnswer = async () => {
        await selectGender('et');
        await fillIn('ubestemtEntal', 'glas');
        fireEvent.click(await screen.findByText('Answer'));
    };

    const acceptPraise = async () => {
        fireEvent.click(await screen.findByText('Continue'));
    };

    const giveUp = async () => {
        fireEvent.click(component.container.querySelector('input[type="reset"]'));
    };

    const giveUpCheck = async () => {
        expect(onResult).toHaveBeenCalledWith(false);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        fireEvent.click(await screen.findByText('Continue'));

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    };

    test('renders', async () => {
        expect(component.container.textContent).toContain('How do you say in Danish');
        expect(component.container.textContent).toContain(question_hund.engelsk);
        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    test('submit incomplete form', async () => {
        fireEvent.click(await screen.findByText('Answer'));

        expect(component.container.textContent).toContain('must be filled in');
        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    test('enter correct answer first time', async () => {
        await giveCorrectAnswer();

        expect(component.container.textContent).toContain('Correct!');
        expect(component.container.textContent).toContain(question_hund.answers[0].køn + ' ' + question_hund.answers[0].ubestemtEntal);
        expect(onResult).toHaveBeenCalledWith(true);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        await acceptPraise();

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    });

    test('enter incorrect answer first time, then correct answer', async () => {
        await giveIncorrectAnswer();

        expect(onResult).toHaveBeenCalledWith(false);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        await giveCorrectAnswer();

        expect(component.container.textContent).toContain('Correct!');
        expect(component.container.textContent).toContain(question_hund.answers[0].køn + ' ' + question_hund.answers[0].ubestemtEntal);
        expect(onResult).toHaveBeenCalledWith(true);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        await acceptPraise();

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    });

    test('enter incorrect answer first time, then give up', async () => {
        await giveIncorrectAnswer();

        expect(onResult).toHaveBeenCalledWith(false);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        await giveUp();

        expect(component.container.textContent).toContain('You answered: et glas');
        expect(component.container.textContent).toContain('But it was actually: en hund');
        await giveUpCheck();
    });

    test('give up without answering', async () => {
        await giveUp();

        expect(component.container.textContent).toContain('You answered:'); // add '-' ?
        expect(component.container.textContent).toContain('But it was actually: en hund');
        await giveUpCheck();
    });

    // TODO: multiple english answers?
    // - any accepted as correct
    // - show all on praise
    // - show all on give up

});
