import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

declare const firebase: typeof import('firebase');

import {Recorder, DBRecorder} from "lib/recorder";
import {Question} from "lib/types/question";
import {currentQuestionsAndResults} from "lib/app_context";
import {useState} from "react";
import SFQ2 from "./sfq2";
import {getEligibleQuestions} from "lib/questions_and_results";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./index.css");

type Props = {
    user: firebase.User;
    vocabSubset?: Set<string>;
} & WithTranslation

const applyVocabSubset = (
    vocabSubset: Set<string> | undefined,
    questions: Question<any, any>[]
): Question<any, any>[] => {
    if (!vocabSubset) return questions;

    return questions.filter(question => {
        return question.vocabSources?.some(
            vocabEntry => vocabEntry.vocabKey && vocabSubset.has(vocabEntry.vocabKey)
        );
    });
};

const Tester = (props: Props) => {
    const [questionCount, setQuestionCount] = useState<number>();
    const [currentQuestion, setCurrentQuestion] = useState<Question<any, any>>();
    const [recorder, setRecorder] = useState<Recorder>();
    const [seq, setSeq] = useState<number>(0);

    const nextQuestion = () => {
        const questionsAndResults = currentQuestionsAndResults.getValue();

        const eligibleQuestions = applyVocabSubset(
            props.vocabSubset,
            getEligibleQuestions(questionsAndResults)
        );

        setQuestionCount(eligibleQuestions.length);

        if (eligibleQuestions.length > 0) {
            const newQuestion = eligibleQuestions[
                Math.floor(Math.random() * eligibleQuestions.length)
            ];
            setCurrentQuestion(newQuestion);
            setRecorder(new DBRecorder(props.user, newQuestion.resultsKey));
            setSeq(seq + 1);
        } else {
            setCurrentQuestion(undefined);
            setRecorder(undefined);
        }
    };

    const { t } = props;

    if (questionCount === undefined) {
        nextQuestion();
        return null;
    }

    return (
        <div className={styles.Tester}>
            <h1>{t('tester.heading')}</h1>

            <p className={styles.questionCount}>
                {t('tester.question_count', { count: questionCount })}
                {props.vocabSubset && (' ' + t('tester.subset_marker'))}
            </p>

            {(questionCount === 0) && (
                <p>{t('tester.zero_questions')}</p>
            )}

            {currentQuestion && recorder && <SFQ2
                key={seq}
                question={currentQuestion}
                recorder={recorder}
                onDone={nextQuestion}
            />}
        </div>
    );
};

export default withTranslation()(Tester);
