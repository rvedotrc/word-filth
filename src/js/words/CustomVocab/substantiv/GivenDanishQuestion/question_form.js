import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import * as stdq from "../../../shared/standard_form_question";

class QuestionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...stdq.defaultState(),
            engelsk: '',
        };
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    getGivenAnswer() {
        const { t } = this.props;
        const engelsk = this.state.engelsk.trim().toLowerCase();

        if (engelsk === '') {
            this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
            return;
        }

        return { engelsk };
    }

    checkAnswer({ engelsk }) {
        return this.props.question.answers.some(
            allowable => engelsk.toLowerCase() === allowable.engelsk.toLowerCase()
        );
    }

    allGivenAnswers(givenAnswers) {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        return givenAnswers
            .map((givenAnswer, index) => <span key={index}>{givenAnswer.engelsk}</span>)
            .reduce((prev, curr) => [prev, <br key="br"/>, 'så: ', curr]);
    }

    allAllowableAnswers() {
        if (this.props.question.answers.length === 0) return '-';

        // TODO: t complex
        return this.props.question.answers
            .map(answer => answer.engelsk)
            .sort()
            .map(answer => <b key={answer}>{answer}</b>)
            .reduce((prev, curr) => [prev, ' eller ', curr]);
    }

    renderShowCorrectAnswer(givenAnswers) {
        const { t } = this.props;

        return (
            <div>
                <p>
                    {t('question.shared.wrong.you_answered')}{' '}
                    {this.allGivenAnswers(givenAnswers)}
                </p>
                <p>
                    {t('question.shared.wrong.but_it_was')}{' '}
                    {this.allAllowableAnswers()}
                </p>
            </div>
        );
    }

    renderPraise() {
        const { t } = this.props;

        return (
            <div>
                <p>{t('question.shared.correct')}</p>
                <p>{this.allAllowableAnswers()}</p>
            </div>
        );
    }

    renderQuestionForm() {
        const { t, question } = this.props;

        return (
            <div>
                <p>
                    {t('question.shared.how_do_you_say_in_english', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        danish: <span key="dansk">
                    {question.køn !== 'pluralis' ? (
                        <span>({question.køn}) <b>{question.ubestemtEntalEllerFlertal}</b></span>
                    ) : (
                        <b>{question.ubestemtEntalEllerFlertal}</b>
                    )}</span>
                    })}
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{t('question.shared.label.english')}</td>
                        <td>
                            <input
                                type="text"
                                size="30"
                                value={this.state.engelsk}
                                onChange={(e) => this.handleChange(e, 'engelsk')}
                                autoFocus="yes"
                                data-test-id="answer"
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    onAnswer() { return stdq.onAnswer.call(this) }
    onGiveUp() { return stdq.onGiveUp.call(this) }
    showFadingMessage() { return stdq.showFadingMessage.call(this, ...arguments) }
    render() { return stdq.render.call(this) }
}

QuestionForm.propTypes = {
    ...stdq.propTypes,
    question: PropTypes.object.isRequired,
};

export default withTranslation()(QuestionForm);
