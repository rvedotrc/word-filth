import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextTidier from '../../shared/text_tidier';

class GivenOneLanguageAnswerTheOther extends Component {
    constructor(props) {
        super(props);

        this.state = {
            answerValue: '',

            attempts: [],

            fadingMessage: null,
            showPraise: false,
            showCorrectAnswer: false,
        };
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value;
        this.setState(newState);
    }

    onAnswer() {
        const { t } = this.props;
        const givenAnswer = TextTidier.normaliseWhitespace(this.state.answerValue);

        if (givenAnswer === '') {
            this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
            return;
        }

        const isCorrect = this.checkAnswer(givenAnswer);
        this.props.onResult(isCorrect);

        if (isCorrect) {
            this.setState({ showPraise: true });
        } else {
            const attempts = this.state.attempts.concat(givenAnswer);
            this.setState({ attempts });
            this.showFadingMessage(t('question.shared.not_correct'));
        }
    }

    checkAnswer(givenAnswer) {
        return this.props.allowableAnswers.some(allowableAnswer =>
            TextTidier.normaliseWhitespace(allowableAnswer).toLowerCase() ===
            TextTidier.normaliseWhitespace(givenAnswer).toLowerCase()
        );
    }

    onGiveUp() {
        this.props.onResult(false);
        this.setState({ showCorrectAnswer: true });
    }

    showFadingMessage(message, timeout) {
        this.setState({ fadingMessage: message });
        const t = this;
        window.setTimeout(() => {
            t.setState((prevState, props) => {
                if (prevState.fadingMessage === message) {
                    return({ fadingMessage: null });
                } else {
                    return {};
                }
            });
        }, timeout || 2500);
    }

    allAttempts() {
        if (this.state.attempts.length === 0) return '-';

        // TODO: t complex
        return this.state.attempts
            .map(sv => <span key={sv}>{sv}</span>)
            .reduce((prev, curr) => [prev, <br/>, 'så: ', curr]);
    }

    allAnswers() {
        if (this.props.allowableAnswers.length === 0) return '-';

        // TODO: t complex
        return this.props.allowableAnswers.sort()
            .map(sv => <b key={sv}>{sv}</b>)
            .reduce((prev, curr) => [prev, ' eller ', curr]);
    }

    render() {
        const { t } = this.props;

        if (this.state.showCorrectAnswer) {
            return (
                <div>
                    <p>
                        {t('question.shared.wrong.you_answered')}{' '}
                        {this.allAttempts()}
                    </p>
                    <p>
                        {t('question.shared.wrong.but_it_was')}{' '}
                        {this.allAnswers()}
                    </p>
                    <p>
                        {this.props.hasGimme && (
                            <input
                                type="button"
                                value={t('question.shared.gimme.button')}
                                disabled={this.props.gimmeUsed}
                                onClick={this.props.onGimme}
                                data-test-id="gimme"
                            />
                        )}
                        <input
                            type="button"
                            value={t('question.shared.continue.button')}
                            onClick={this.props.onDone}
                            autoFocus="yes"
                            data-test-id="continue"
                        />
                    </p>
                </div>
            );
        }

        if (this.state.showPraise) {
            return (
                <div>
                    <p>{t('question.shared.correct')}</p>
                    <p>{this.allAnswers()}</p>
                    <p>
                        {this.props.hasGimme && (
                            <input
                                type="button"
                                value={t('question.shared.gimme.button')}
                                disabled={this.props.gimmeUsed}
                                onClick={this.props.onGimme}
                                data-test-id="gimme"
                            />
                        )}
                        <input
                            type="button"
                            value={t('question.shared.continue.button')}
                            onClick={this.props.onDone}
                            autoFocus="yes"
                        />
                    </p>
                </div>
            );
        }

        const { fadingMessage } = this.state;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onAnswer(); }}
                onReset={(e) => { e.preventDefault(); this.onGiveUp(); }}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
            >
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

                <p>
                    <input type="submit" value={t('question.shared.answer.button')}/>
                    <input type="reset" value={t('question.shared.give_up.button')}/>
                    <input type="button" value={t('question.shared.skip.button')} onClick={this.props.onDone}/>
                </p>

                {fadingMessage && (
                    <p key={fadingMessage}>{fadingMessage}</p>
                )}
            </form>
        );
    }
}

GivenOneLanguageAnswerTheOther.propTypes = {
    question: PropTypes.string.isRequired,
    allowableAnswers: PropTypes.array.isRequired,

    // canAnswer: PropTypes.bool.isRequired,
    hasGimme: PropTypes.bool.isRequired,
    gimmeUsed: PropTypes.bool.isRequired,

    onResult: PropTypes.func.isRequired,
    onGimme: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
};

export default GivenOneLanguageAnswerTheOther;
