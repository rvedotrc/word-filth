import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class QuestionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            engelsk: '',

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
        const { t } = this.props;
        const engelsk = this.state.engelsk.trim().toLowerCase();

        if (engelsk === '') {
            this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
            return;
        }

        const isCorrect = this.checkAnswer(engelsk);
        this.props.onResult(isCorrect);

        if (isCorrect) {
            this.setState({ showPraise: true });
        } else {
            const attempts = this.state.attempts.concat(engelsk);
            this.setState({ attempts });
            this.showFadingMessage(t('question.shared.not_correct'));
        }
    }

    checkAnswer(engelsk) {
        return(this.props.allowableAnswers.some(allowable => engelsk.toLowerCase() === allowable.toLowerCase()));
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
        const { t, substantiv } = this.props;

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

        if (this.state.showPraise) {
            return (
                <div>
                    <p>{t('question.shared.correct')}</p>
                    <p>{this.allAnswers()}</p>
                    <p>
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
                    {t('question.shared.how_do_you_say_in_english', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        danish: <span>
                    {substantiv.ubestemtEntal ? (
                        <span>({substantiv.køn}) <b>{substantiv.ubestemtEntal}</b></span>
                    ) : (
                        <b>{substantiv.ubestemtFlertal}</b>
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

                <p>
                    <input type="submit" value={t('question.shared.answer.button')}/>
                    <input type="reset" value={t('question.shared.give_up.button')}/>
                </p>

                {fadingMessage && (
                    <p key={fadingMessage}>{fadingMessage}</p>
                )}
            </form>
        );
    }
}

QuestionForm.propTypes = {
    substantiv: PropTypes.object.isRequired,
    allowableAnswers: PropTypes.array.isRequired,
    onResult: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
};

export default withTranslation()(QuestionForm);
