import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

declare const firebase: typeof import('firebase');

import Questions from '../../Questions';
import SpacedRepetition from '../../SpacedRepetition';
import {Question} from "../../words/CustomVocab/types";
import {currentQuestionsAndResults} from "lib/app_context";
import {useState} from "react";

type Props = {
    user: firebase.User;
    vocabSubset?: Set<string>;
} & WithTranslation

const applyVocabSubset = (
    vocabSubset: Set<string> | undefined,
    questions: Question[]
): Question[] => {
    if (!vocabSubset) return questions;

    return questions.filter(question => {
        return question.vocabSources?.some(
            vocabEntry => vocabEntry.vocabKey && vocabSubset.has(vocabEntry.vocabKey)
        );
    });
};

const Tester = (props: Props) => {

    const [questionCount, setQuestionCount] = useState<number>();
    const [currentQuestion, setCurrentQuestion] = useState<Question>();
    const [recorder, setRecorder] = useState<SpacedRepetition>();
    const [currentResult, setCurrentResult] = useState<boolean>();

    const nextQuestion = () => {
        const questionsAndResults = currentQuestionsAndResults.getValue();

        const eligibleQuestions = applyVocabSubset(
            props.vocabSubset,
            Questions.getEligibleQuestions(questionsAndResults)
        );

        setQuestionCount(eligibleQuestions.length);

        if (eligibleQuestions.length > 0) {
            const newQuestion = eligibleQuestions[
                Math.floor(Math.random() * eligibleQuestions.length)
                ];
            setCurrentQuestion(newQuestion);
            setRecorder(new SpacedRepetition(props.user, newQuestion.resultsKey));
            setCurrentResult(undefined);
        } else {
            setCurrentQuestion(undefined);
            setRecorder(undefined);
            setCurrentResult(undefined);
        }
    }

    const recordResult = (isCorrect: boolean): Promise<void> => {
        if (!currentQuestion) throw 'No currentQuestion';
        if (!recorder) throw 'No currentQuestion';

        console.debug(`Recording ${isCorrect ? 'correct' : 'incorrect'} answer for ${currentQuestion.resultsKey}`);

        return recorder.recordAnswer(isCorrect).then(() =>
            setCurrentResult(recorder.isCorrect())
        );
    };

    const { t } = props;

    if (!questionCount) {
        nextQuestion();
        return null;
    }

    return (
        <div>
            <h1>{t('tester.heading')}</h1>

            <p id="questionCount">
                {t('tester.question_count', { count: questionCount })}
                {props.vocabSubset && (' ' + t('tester.subset_marker'))}
            </p>

            {(questionCount === 0) && (
                <p>{t('tester.zero_questions')}</p>
            )}

            {currentQuestion && recorder && currentQuestion.createQuestionForm({
                t: props.t,
                i18n: props.i18n,
                tReady: props.tReady,

                key: currentQuestion.resultsKey,
                onResult: isCorrect => recordResult(isCorrect),
                currentResult,
                onDone: () => nextQuestion(),
            })}
        </div>
    );

};

export default withTranslation()(Tester);
