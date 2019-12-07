import React, { Component } from 'react';
import PropTypes from 'prop-types';

class QuestionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            danskValue: '',

            attempts: [],

            fadingMessage: null,
            showPraise: false,
            showCorrectAnswer: false,
        };
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    onAnswer() {
        const dansk = this.state.danskValue.trim().toLowerCase();

        if (dansk === '') {
            this.showFadingMessage("Svaret skal udfyldes");
            return;
        }

        const isCorrect = this.checkAnswer(dansk);
        this.props.onResult(isCorrect);

        if (isCorrect) {
            this.setState({ showPraise: true });
        } else {
            const attempts = this.state.attempts.concat(dansk);
            this.setState({ attempts });
            this.showFadingMessage('Næ, det er det ikke');
        }
    }

    checkAnswer(dansk) {
        return this.props.question.udtryk.dansk === dansk;
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
                    <p>Men det var faktisk: {this.props.question.udtryk.dansk}</p>
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
            return (
                <div>
                    <p>Lige præcis!</p>
                    <p><b>{this.props.question.udtryk.dansk}</b></p>
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
                    Hvordan siger man på dansk, <b>{this.props.question.udtryk.engelsk}</b>?
                </p>

                <table>
                    <tbody>
                        <tr>
                            <td>Dansk:</td>
                            <td><input
                                value={this.state.danskValue}
                                size="30"
                                autoFocus="yes"
                                onChange={(e) => this.handleChange(e, 'danskValue')}
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

QuestionForm.propTypes = {
    question: PropTypes.object.isRequired,
    onResult: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
};

export default QuestionForm;
