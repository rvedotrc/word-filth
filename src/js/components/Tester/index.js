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

            this.setState({ questionCount: eligibleQuestions.length });

            if (eligibleQuestions.length === 0) {
                this.setState({ currentQuestion: null });
            } else {
                const currentQuestion = eligibleQuestions[Math.floor(Math.random() * eligibleQuestions.length)];
                this.setState({ currentQuestion, recordedResult: false });
            }
        });
    }

    recordResult(isCorrect) {
        if (!this.state.recordedResult) {
            this.setState({ recordedResult: true });
            console.log(`Recording ${isCorrect ? 'correct' : 'incorrect'} answer for ${this.state.currentQuestion.resultsKey}`);
            return new SpacedRepetition(
                this.props.user,
                this.state.currentQuestion.resultsKey
            ).recordAnswer(isCorrect);
        }
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
                    onResult: (isCorrect) => this.recordResult(isCorrect),
                    onDone: () => this.nextQuestion(),
                })}
            </div>
        )
    }
}

Tester.propTypes = {
    user: PropTypes.object.isRequired
};

export default withTranslation()(Tester);
