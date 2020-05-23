import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import GenderInput from "../../../../components/shared/gender_input";
import * as stdq from "../../../shared/standard_form_question";

class QuestionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...stdq.defaultState(),
            kønValue: '',
            ubestemtEntalValue: '',
        };
    }

    handleKøn(value) {
        this.setState({ kønValue:  value });
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    getGivenAnswer() {
        const {t} = this.props;
        const køn = this.state.kønValue;
        const ubestemtEntal = this.state.ubestemtEntalValue.trim().toLowerCase();

        if (!køn || ubestemtEntal === '') {
            this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
            return;
        }

        return { køn, ubestemtEntal };
    }

    checkAnswer({ køn, ubestemtEntal }) {
        const { question } = this.props;

        return question.answers.some(answer => (
            køn === answer.køn
            && ubestemtEntal.toLowerCase() === answer.ubestemtEntal.toLowerCase()
        ));
    }

    allGivenAnswers(givenAnswers) {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        const t = givenAnswers
            .map(answer => `${answer.køn} ${answer.ubestemtEntal}`)
            .map((sv, index) => <span key={index}>{sv}</span>)
            .reduce((prev, curr) => [prev, <br key="br"/>, 'så: ', curr]);

        return <span>{t}</span>;
    }

    allAllowableAnswers() {
        // TODO: t complex
        const t = this.props.question.answers
            .map(answer => `${answer.køn} ${answer.ubestemtEntal}`)
            .sort()
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
        const { t, question } = this.props;

        const engelskArtikel = (
            question.engelsk.match(/^[aeiou]/)
                ? 'an'
                : 'a'
        );

        return (
            <div>
                <p>
                    {t('question.shared.how_do_you_say_in_danish', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        english: <b>{engelskArtikel} {question.engelsk}</b>,
                    })}
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{t('question.shared.label.danish')}</td>
                        <td>
                            <span style={{margin: 'auto 0.5em'}}>
                                <GenderInput
                                    value={this.state.kønValue}
                                    onChange={v => this.handleKøn(v)}
                                    autoFocus="yes"
                                    data-test-id="køn"
                                />
                            </span>
                            <input
                                type="text"
                                size="30"
                                value={this.state.ubestemtEntalValue}
                                onChange={(e) => this.handleChange(e, 'ubestemtEntalValue')}
                                data-test-id="ubestemtEntal"
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
