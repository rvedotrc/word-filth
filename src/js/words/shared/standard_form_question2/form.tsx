import * as React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';
import {Question} from "../../CustomVocab/types";
import {useMemo, useState} from "react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./form.css');

type Props<T, C, Q extends Question<T, C>> = {
    question: Q;
    onAttempt: (attempt: T, isCorrect: boolean) => void;
    onGiveUp: () => void;
    onNextQuestion: () => void;
} & WithTranslation

const SFQ2Form = <T, C, Q extends Question<T, C>>(props: Props<T, C, Q>) => {

    const {t, question} = props;

    const [attempt, setAttempt] = useState<T>();
    const [message, setMessage] = useState<string>();

    const FormComponent = useMemo(() => withTranslation()(
        props.question.getQuestionFormComponent()
    ), [props.question.resultsKey]);

    const answer = () => {
        if (!attempt) return;

        const isCorrect = question.correct.some(correctAnswer =>
            question.doesAttemptMatchCorrectAnswer(attempt, correctAnswer)
        );

        props.onAttempt(attempt, isCorrect);
        if (!isCorrect) showMessage(t('question.shared.not_correct'));
    };

    const showMessage = (newMessage: string, timeout?: number) => {
        setMessage(newMessage);

        window.setTimeout(() => {
            setMessage((prevMessage) =>
                (prevMessage === newMessage)
                ? undefined
                : prevMessage
            );
        }, timeout || 2500);
    }

    return <div>
        <form className={styles.question}
            onSubmit={e => { e.preventDefault(); answer(); }}
        >
            <FormComponent
                lang={question.lang}
                onAttempt={setAttempt}
                onShowMessage={showMessage}
            />

            <p>
                <input
                    type={"submit"}
                    disabled={attempt === undefined}
                    value={"" + t('question.shared.answer.button')}
                />
                <input
                    type={"reset"}
                    onClick={props.onGiveUp}
                    value={"" + t('question.shared.give_up.button')}
                />
                <input
                    type={"button"}
                    onClick={props.onNextQuestion}
                    value={"" + t('question.shared.skip.button')}
                />
            </p>
        </form>

        {message && <p>{message}</p>}
    </div>;

};

export default withTranslation()(SFQ2Form);
