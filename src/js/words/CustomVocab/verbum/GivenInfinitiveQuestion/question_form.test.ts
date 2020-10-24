import {fireEvent, render, RenderResult, screen} from "@testing-library/react";

import i18n from "../../../../../i18n-setup";

import GivenInfinitiveQuestion from './index';
import QuestionForm from './question_form';

describe(QuestionForm, () => {

    const onResult = jest.fn();
    const onDone = jest.fn();

    let component: RenderResult;

    const fillIn = async (field: string, value: string) => {
        fireEvent.change(
            await screen.findByTestId(field),
            { target: { value }},
        );
    };

    const giveCorrectAnswer = async () => {
        await fillIn('nutid', 'ser');
        await fillIn('datid', 'så');
        await fillIn('førnutid', 'set');
        fireEvent.click(await screen.findByText('Answer'));
    };

    const giveIncorrectAnswer = async () => {
        await fillIn('nutid', 'xxx');
        await fillIn('datid', 'yyy');
        await fillIn('førnutid', 'zzz');
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

    describe('simple', () => {
        const verb_se = {
            lang: 'da',
            infinitiv: 'at se',
            nutid: ['ser'],
            datid: ['så'],
            førnutid: ['set'],
            engelsk: 'to see',
        };

        beforeEach(() => {
            onResult.mockReset();
            onDone.mockReset();

            const q = new GivenInfinitiveQuestion(verb_se.infinitiv, [verb_se], []);

            component = render(
                q.createQuestionForm({
                    key: q.resultsKey,

                    t: i18n.t,
                    i18n: i18n,
                    tReady: true,

                    onResult: onResult,
                    onDone: onDone,
                })
            );
        });

        test('renders', async () => {
            expect(component.container.textContent).toContain('How do you inflect the verb');
            expect(component.container.textContent).toContain('at se');
            expect(onResult).not.toHaveBeenCalled();
            expect(onDone).not.toHaveBeenCalled();
        });

        test('submit incomplete form', async () => {
            fireEvent.click(await screen.findByText('Answer'));

            expect(component.container.textContent).toContain('All three tenses must be filled in');
            expect(onResult).not.toHaveBeenCalled();
            expect(onDone).not.toHaveBeenCalled();
        });

        test('enter correct answer first time', async () => {
            await giveCorrectAnswer();

            expect(component.container.textContent).toContain('Correct!');
            expect(component.container.textContent).toContain('ser, så, set');
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
            expect(component.container.textContent).toContain('ser, så, set');
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

            expect(component.container.textContent).toContain('You answered: xxx, yyy, zzz');
            expect(component.container.textContent).toContain('But it was actually: ser, så, set');
            await giveUpCheck();
        });

        test('give up without answering', async () => {
            await giveUp();

            expect(component.container.textContent).toContain('You answered: -');
            expect(component.container.textContent).toContain('But it was actually: ser, så, set');
            await giveUpCheck();
        });
    });

    // TODO: multiple forms within a verb
    // - any accepted as correct
    // - show all on praise
    // - show all on give up

    // TODO: multiple verbs
    // - any accepted as correct
    // - show all on praise
    // - show all on give up

    describe('multiple verbs', () => {
        const verbs = [
            {
                lang: 'da',
                "tekst": "at hænge, -r, hang eller hængte, hængt",
                "imperativ": "hæng",
                "infinitiv": "at hænge",
                "nutid": [
                    "hænger"
                ],
                "datid": [
                    "hang",
                    "hængte"
                ],
                "førnutid": [
                    "hængt"
                ],
                "engelsk": "to hang (e.g. curtains, a picture, etc)"
            },
            {
                lang: 'da',
                "tekst": "at hænge, -r, hængte, hængt",
                "imperativ": "hæng",
                "infinitiv": "at hænge",
                "nutid": [
                    "hænger"
                ],
                "datid": [
                    "hængte"
                ],
                "førnutid": [
                    "hængt"
                ],
                "engelsk": "to hang (a person, or an object e.g. from a rope)"
            },
        ];

        beforeEach(() => {
            onResult.mockReset();
            onDone.mockReset();

            const q = new GivenInfinitiveQuestion(verbs[0].infinitiv, verbs, []);

            component = render(
                q.createQuestionForm({
                    key: q.resultsKey,
                    t: i18n.t,
                    i18n: i18n,
                    tReady: true,

                    onResult,
                    onDone,
                })
            );
        });

        it('wrong guess, then give up', async () => {
            await giveIncorrectAnswer();
            await giveUp();

            // console.log(wrapper.html());
        });

        it('give up immediately', async () => {
            await giveUp();

            // console.log(wrapper.html());
        });
    });

});
