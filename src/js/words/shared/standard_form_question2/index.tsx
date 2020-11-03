import * as React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';

import {Question} from "../../CustomVocab/types";
import Form from "./form";
import Result from "./result";
import {Recorder} from "../../../SpacedRepetition";
import {useMemo, useState} from "react";

type Props<AT> = {
    recorder: Recorder;
    question: Question<any, any>;
    onDone: () => void;
} & WithTranslation

const SFQ2 = <T, C>(props: Props<T>) => {

    const [attempts, setAttempts] = useState<T[]>([]);
    const [firstAttemptCorrect, setFirstAttemptCorrect] = useState<boolean>();
    const [answering, setAnswering] = useState<boolean>(true);

    const HeaderComponent = useMemo(() => withTranslation()(
        props.question.getQuestionHeaderComponent()
    ), [props.question.resultsKey]);

    const onAttempt = (attempt: T, isCorrect: boolean) => {
        if (attempts.length === 0) {
            props.recorder.recordAnswer(isCorrect);
            setFirstAttemptCorrect(isCorrect);
        }

        setAttempts([...attempts, attempt]);
        setAnswering(!isCorrect);
    };

    const giveUp = () => {
        if (attempts.length === 0) {
            props.recorder.recordAnswer(false);
        }

        setAnswering(false);
    };

    const recordResult = (isCorrect: boolean): Promise<void> => {
        return props.recorder.recordAnswer(isCorrect);
    };

    return <div className={"sfq2"}>
        <HeaderComponent question={props.question}/>

        {answering
            ? <Form
                question={props.question}
                onNextQuestion={props.onDone}
                onAttempt={(attempt: T, isCorrect: boolean) => onAttempt(attempt, isCorrect)}
                onGiveUp={() => giveUp()}
            />
            : <Result
                question={props.question}
                attempts={attempts}
                firstAttemptCorrect={firstAttemptCorrect}
                onRecordResult={isCorrect => recordResult(isCorrect)}
                onNextQuestion={props.onDone}
            />
        }
    </div>;

};

export default withTranslation()(SFQ2);
