import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

declare const firebase: typeof import('firebase');

import Questions from '../../Questions';
import SpacedRepetition from '../../SpacedRepetition';
import {Question} from "../../words/CustomVocab/types";
import {currentQuestionsAndResults} from "lib/app_context";

type Props = {
    user: firebase.User;
    vocabSubset?: Set<string>;
} & WithTranslation

type State = {
    questionCount: number;
    currentQuestion: Question | null;
    hasGimme: boolean;
    gimmeUsed: boolean;
    gimmeHandle: SpacedRepetition | null;
    canAnswer: boolean;
}

class Tester extends React.Component<Props, State> {
    componentDidMount() {
        if (!this.state?.questionCount) this.nextQuestion();
    }

    private applyVocabSubset(questions: Question[]): Question[] {
        const vocabSubset = this.props.vocabSubset;
        if (!vocabSubset) return questions;

        return questions.filter(question => {
            return !question.vocabSources || question.vocabSources.some(
                vocabEntry => vocabEntry.vocabKey && vocabSubset.has(vocabEntry.vocabKey)
            );
        });
    }

    private nextQuestion() {
        const questionsAndResults = currentQuestionsAndResults.getValue();

        const eligibleQuestions = this.applyVocabSubset(
            Questions.getEligibleQuestions(questionsAndResults)
        );

        this.setState({
            questionCount: eligibleQuestions.length,
            currentQuestion: null,
            canAnswer: false,
            hasGimme: false,
            gimmeUsed: false,
            gimmeHandle: null,
        });

        if (eligibleQuestions.length > 0) {
            const currentQuestion = eligibleQuestions[Math.floor(Math.random() * eligibleQuestions.length)];
            this.setState({ currentQuestion, canAnswer: true });
        }
    }

    private recordResult(isCorrect: boolean) {
        if (this.state.canAnswer) {
            if (!this.state.currentQuestion) throw 'No currentQuestion';

            this.setState({ canAnswer: false });
            console.debug(`Recording ${isCorrect ? 'correct' : 'incorrect'} answer for ${this.state.currentQuestion.resultsKey}`);
            const spacedRepetition = new SpacedRepetition(
                this.props.user,
                this.state.currentQuestion.resultsKey
            );

            if (!isCorrect) {
                this.setState({
                    hasGimme: true,
                    gimmeUsed: false,
                    gimmeHandle: spacedRepetition,
                });
            }

            return spacedRepetition.recordAnswer(isCorrect);
        }
    }

    private gimme() {
        const { gimmeHandle } = this.state;
        if (!gimmeHandle) return;

        this.setState({ gimmeUsed: true, gimmeHandle: null });
        gimmeHandle.gimme();
        this.nextQuestion();
    }

    render() {
        if (!this.state) return null;
        const { questionCount, currentQuestion } = this.state;
        const { t } = this.props;

        return (
            <div>
                <h1>{t('tester.heading')}</h1>

                <p id="questionCount">
                    {t('tester.question_count', { count: questionCount })}
                    {this.props.vocabSubset && (' ' + t('tester.subset_marker'))}
                </p>

                {(questionCount === 0) && (
                    <p>{t('tester.zero_questions')}</p>
                )}

                {currentQuestion && currentQuestion.createQuestionForm({
                    t: this.props.t,
                    i18n: this.props.i18n,
                    tReady: this.props.tReady,

                    key: currentQuestion.resultsKey,
                    // canAnswer: this.state.canAnswer,
                    hasGimme: this.state.hasGimme,
                    gimmeUsed: this.state.gimmeUsed,
                    onResult: isCorrect => this.recordResult(isCorrect),
                    onGimme: () => this.gimme(),
                    onDone: () => this.nextQuestion(),
                })}
            </div>
        )
    }
}

export default withTranslation()(Tester);
