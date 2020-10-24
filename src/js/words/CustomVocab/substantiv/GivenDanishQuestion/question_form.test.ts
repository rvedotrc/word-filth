import {render, fireEvent, screen, RenderResult} from '@testing-library/react'

import i18n from "../../../../../i18n-setup";

import GivenDanishQuestion from './index';
import QuestionForm from './question_form';

describe(QuestionForm, () => {

    const question_hund = {
        lang: 'da',
        køn: 'en',
        ubestemtEntalEllerFlertal: 'hund',
        answers: [{engelsk: 'dog'}],
        vocabSources: [],
    };

    const onResult = jest.fn();
    const onDone = jest.fn();

    let component: RenderResult;

    beforeEach(() => {
        onResult.mockReset();
        onDone.mockReset();

        const q = new GivenDanishQuestion(question_hund);

        i18n.changeLanguage('en');

        component = render(
            q.createQuestionForm({
                i18n,
                t: i18n.t,
                tReady: true,

                key: q.resultsKey,

                onResult,
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

    const giveCorrectAnswer = async () => {
        await fillIn('answer', 'dog');
        fireEvent.click(await screen.findByText('Answer'));
    };

    const giveIncorrectAnswer = async () => {
        await fillIn('answer', 'cat');
        fireEvent.click(await screen.findByText('Answer'));
    };

    const acceptPraise = async () => {
        fireEvent.click(await screen.findByText('Continue'));
    };

    const giveUp = async () => {
        const element = component.container.querySelector('input[type="reset"]');
        if (!element) throw 'Failed to find reset button';
        fireEvent.click(element);
    };

    const giveUpCheck = async () => {
        expect(onResult).toHaveBeenCalledWith(false);
        expect(onDone).not.toHaveBeenCalled();
        onResult.mockReset();

        fireEvent.click(await screen.findByText('Continue'));

        expect(onResult).not.toHaveBeenCalled();
        expect(onDone).toHaveBeenCalled();
    };

    test('renders', () => {
        expect(component.container.textContent).toContain('How do you say in English');
        expect(component.container.textContent).toContain(question_hund.ubestemtEntalEllerFlertal);
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
        expect(component.container.textContent).toContain(question_hund.answers[0].engelsk);
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
        expect(component.container.textContent).toContain(question_hund.answers[0].engelsk);
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

        expect(component.container.textContent).toContain('You answered: cat');
        expect(component.container.textContent).toContain('But it was actually: dog');
        await giveUpCheck();
    });

    test('give up without answering', async () => {
        await giveUp();

        expect(component.container.textContent).toContain('You answered: -');
        expect(component.container.textContent).toContain('But it was actually: dog');
        await giveUpCheck();
    });

    // TODO: multiple english answers
    // - any accepted as correct
    // - show all on praise
    // - show all on give up

});

