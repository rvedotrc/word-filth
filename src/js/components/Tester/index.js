import React, { Component } from 'react';
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

        return (
            <div>
                <h1>Øv Dine Verber og Ordforråd</h1>

                <p id="questionCount">Ting, der kan øves: {questionCount}</p>

                {(questionCount === 0) && (
                    <p>Der findes intet at se her lige nu :-)</p>
                )}

                {currentQuestion && currentQuestion.createQuestionForm({
                    key: currentQuestion.resultsKey,
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

export default Tester;
