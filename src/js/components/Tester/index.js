import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Questions from '../../Questions';
import SpacedRepetition from '../../SpacedRepetition';

class Tester extends Component {
    componentDidMount() {
        this.nextQuestion();
    }

    nextQuestion() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}`);
        ref.once('value').then(snapshot => {
            const db = snapshot.val() || {};

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
        });
    }

    recordResult(isCorrect) {
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
        return gimmeHandle.gimme();
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
                    key: currentQuestion.resultsKey,
                    t: this.props.t,
                    i18n: this.props.i18n,
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

Tester.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default withTranslation()(Tester);
