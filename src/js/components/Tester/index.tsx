import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
declare const firebase: typeof import('firebase');

import Questions from '../../Questions';
import SpacedRepetition from '../../SpacedRepetition';
import {Question} from "../../words/CustomVocab/types";

interface Props extends WithTranslation {
    user: firebase.User;
}

interface State {
    questionCount: number;
    data: any;
    ref: firebase.database.Reference;
    currentQuestion: Question;
    hasGimme: boolean;
    gimmeUsed: boolean;
    gimmeHandle: SpacedRepetition;
    canAnswer: boolean;
}

class Tester extends React.Component<Props, State> {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}`);
        ref.on('value', (snapshot: any) => {
            this.setState({ data: snapshot.val() || {} });
            if (!this.state.questionCount) this.nextQuestion();
        });
        this.setState({ ref: ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    nextQuestion() {
        const db = this.state.data;
        const eligibleQuestions = new Questions(db).getEligibleQuestions();

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

    recordResult(isCorrect: boolean) {
        if (this.state.canAnswer) {
            this.setState({ canAnswer: false });
            console.log(`Recording ${isCorrect ? 'correct' : 'incorrect'} answer for ${this.state.currentQuestion.resultsKey}`);
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

    gimme() {
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
