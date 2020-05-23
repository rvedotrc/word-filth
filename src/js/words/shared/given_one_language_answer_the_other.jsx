import React, { Component } from 'react';
import PropTypes from 'prop-types';

import arrayUniq from 'array-uniq';
import TextTidier from '../../shared/text_tidier';
import * as stdq from './standard_form_question';

class GivenOneLanguageAnswerTheOther extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...(this.state || {}),
            ...stdq.defaultState(),
            answerValue: '',
        };
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value;
        this.setState(newState);
    }

    getGivenAnswer() {
        const givenAnswer = TextTidier.normaliseWhitespace(this.state.answerValue);

        if (givenAnswer === '') {
            return;
        }

        return givenAnswer;
    }

    checkAnswer(givenAnswer) {
        return this.props.allowableAnswers.some(allowableAnswer =>
            TextTidier.normaliseWhitespace(allowableAnswer).toLowerCase() ===
            TextTidier.normaliseWhitespace(givenAnswer).toLowerCase()
        );
    }

    allGivenAnswers(givenAnswers) {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        const t = givenAnswers
            .map((sv, index) => <span key={index}>{sv}</span>)
            .reduce((prev, curr) => [prev, <br key="br"/>, 'så: ', curr]);

        return <span>{t}</span>;
    }

    allAllowableAnswers() {
        if (this.props.allowableAnswers.length === 0) return '-';

        // TODO: t complex
        const t = arrayUniq(this.props.allowableAnswers.sort())
            .map((sv, index) => <b key={index}>{sv}</b>)
            .reduce((prev, curr) => [prev, ' eller ', curr]);

        return <span>{t}</span>;
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
        return (
            <div>
                <p>
                    {this.questionPhrase(this.props.question)}
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{this.answerLabel()}</td>
                        <td><input
                            value={this.state.answerValue}
                            size="30"
                            autoFocus="yes"
                            onChange={(e) => this.handleChange(e, 'answerValue')}
                        /></td>
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

GivenOneLanguageAnswerTheOther.propTypes = {
    ...stdq.propTypes,
    question: PropTypes.string.isRequired,
    allowableAnswers: PropTypes.array.isRequired,
};

// TODO: why no "withTranslation()(...)" here?
export default GivenOneLanguageAnswerTheOther;
