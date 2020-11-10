import * as React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';
import {Question} from "lib/types/question";
import {useEffect, useMemo, useRef, useState} from "react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./form.css');

type Props<T, C, Q extends Question<T, C>> = {
    question: Q;
    onAttempt: (attempt: T, isCorrect: boolean) => void;
    onGiveUp: () => void;
    onNextQuestion: () => void;
} & WithTranslation

const usePrevious = (value: string | undefined) => {
    const ref = useRef<string | undefined>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const SFQ2Form = <T, C, Q extends Question<T, C>>(props: Props<T, C, Q>) => {

    const {t, question} = props;

    const [attempt, setAttempt] = useState<T>();
    const [message, setMessage] = useState<string>();
    const prevMessage = usePrevious(message);

    const FormComponent = useMemo(() => withTranslation()(
        props.question.getQuestionFormComponent()
    ), [props.question.resultsKey]);

    useEffect(
        () => {
            if (message && message !== prevMessage) {
                const handle = window.setTimeout(
                    () => setMessage(undefined),
                    2500
                );
                return () => window.clearTimeout(handle);
            }
        },
        [message],
    );

    const answer = () => {
        if (!attempt) return;

        const isCorrect = question.correct.some(correctAnswer =>
            question.doesAttemptMatchCorrectAnswer(attempt, correctAnswer)
        );

        props.onAttempt(attempt, isCorrect);
        if (!isCorrect) setMessage(t('question.shared.not_correct'));
    };

    return <>
        <form className={styles.question}
            onSubmit={e => { e.preventDefault(); answer(); }}
        >
            <FormComponent
                lang={question.lang}
                onAttempt={setAttempt}
                onShowMessage={setMessage}
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
    </>;

};

export default withTranslation()(SFQ2Form);
