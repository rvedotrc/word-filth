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
    const [hasGimme, setHasGimme] = useState<boolean>(false);
    const [gimmeUsed, setGimmeUsed] = useState<boolean>(false);
    const [gimmeHandle, setGimmeHandle] = useState<SpacedRepetition>();
    const [canAnswer, setCanAnswer] = useState<boolean>(false);

    const nextQuestion = () => {
        const questionsAndResults = currentQuestionsAndResults.getValue();

        const eligibleQuestions = applyVocabSubset(
            props.vocabSubset,
            Questions.getEligibleQuestions(questionsAndResults)
        );

        setQuestionCount(eligibleQuestions.length);
        setCurrentQuestion(undefined);
        setCanAnswer(false);
        setHasGimme(false);
        setGimmeUsed(false);
        setGimmeHandle(undefined);

        if (eligibleQuestions.length > 0) {
            const newQuestion = eligibleQuestions[
                Math.floor(Math.random() * eligibleQuestions.length)
            ];
            setCurrentQuestion(newQuestion);
            setCanAnswer(true);
        }
    }

    const recordResult = (isCorrect: boolean) => {
        if (!canAnswer) return;
        if (!currentQuestion) throw 'No currentQuestion';

        setCanAnswer(false);
        console.debug(`Recording ${isCorrect ? 'correct' : 'incorrect'} answer for ${currentQuestion.resultsKey}`);

        const spacedRepetition = new SpacedRepetition(
            props.user,
            currentQuestion.resultsKey
        );

        if (!isCorrect) {
            setHasGimme(true);
            setGimmeUsed(false);
            setGimmeHandle(spacedRepetition);
        }

        return spacedRepetition.recordAnswer(isCorrect);
    };

    const gimme = () => {
        if (!gimmeHandle) return;

        setGimmeUsed(true);
        setGimmeHandle(undefined);
        gimmeHandle.gimme();
        nextQuestion();
    }

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

            {currentQuestion && currentQuestion.createQuestionForm({
                t: props.t,
                i18n: props.i18n,
                tReady: props.tReady,

                key: currentQuestion.resultsKey,
                // canAnswer: this.state.canAnswer,
                hasGimme,
                gimmeUsed,
                onResult: isCorrect => recordResult(isCorrect),
                onGimme: () => gimme(),
                onDone: () => nextQuestion(),
            })}
        </div>
    );

};

export default withTranslation()(Tester);
