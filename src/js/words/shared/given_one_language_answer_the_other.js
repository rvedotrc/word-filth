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
        const givenAnswer = TextTidier.normaliseWhitespace(this.state.answerValue);

        if (givenAnswer === '') {
            this.showFadingMessage("Svaret skal udfyldes");
            return;
        }

        const isCorrect = this.checkAnswer(givenAnswer);
        this.props.onResult(isCorrect);

        if (isCorrect) {
            this.setState({ showPraise: true });
        } else {
            const attempts = this.state.attempts.concat(givenAnswer);
            this.setState({ attempts });
            this.showFadingMessage('Næ, det er det ikke');
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

    render() {
        if (this.state.showCorrectAnswer) {
            return (
                <div>
                    <p>Du svarede: {this.state.attempts.join('; ')}</p>
                    <p>Men det var faktisk: {this.props.allowableAnswers.sort().join(', eller ')}</p>
                    <p>
                        <input
                            type="button"
                            value="Fortsæt"
                            onClick={this.props.onDone}
                            autoFocus="yes"
                        />
                    </p>
                </div>
            );
        }

        if (this.state.showPraise) {
            const allAnswers = this.props.allowableAnswers.sort()
                .map(sv => <b>{sv}</b>)
                .reduce((prev, curr) => [prev, ' eller ', curr]);

            return (
                <div>
                    <p>Lige præcis!</p>
                    <p>{allAnswers}</p>
                    <p>
                        <input
                            type="button"
                            value="Fortsæt"
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
                    <input type="submit" value="Svar"/>
                    <input type="reset" value="Giv op"/>
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
    onResult: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
};

export default GivenOneLanguageAnswerTheOther;
