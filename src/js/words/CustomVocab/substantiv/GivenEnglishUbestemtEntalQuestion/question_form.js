import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class QuestionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            kønValue: '',
            ubestemtEntalValue: '',

            attempts: [],

            fadingMessage: null,
            showPraise: false,
            showCorrectAnswer: false,
        };
    }

    handleKøn(e) {
        const value = e.target.value.toLowerCase();

        if (value.trim().match(/^(en|n|f|fælleskøn)$/)) {
            this.setState({ kønValue: 'en' });
        }
        else if (value.trim().match(/^(et|t|i|intetkøn)$/)) {
            this.setState({ kønValue: 'et' });
        }
        else if (value.trim().match(/^(p|pluralis)$/)) {
            this.setState({ kønValue: 'pluralis' });
        }
        else if (value === 'e') {
            this.setState({ kønValue: 'e' });
        } else {
            this.setState({ kønValue: '' });
        }
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    onAnswer() {
        const { t } = this.props;
        const køn = this.state.kønValue.trim().toLowerCase();
        const ubestemtEntal = this.state.ubestemtEntalValue.trim().toLowerCase();

        const harKøn = (køn === 'en' || køn === 'et' || køn === 'pluralis');

        if (!harKøn || ubestemtEntal === '') {
            this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
            return;
        }

        const isCorrect = this.checkAnswer(køn, ubestemtEntal);
        this.props.onResult(isCorrect);

        if (isCorrect) {
            this.setState({ showPraise: true });
        } else {
            const attempts = this.state.attempts.concat(`${køn} ${ubestemtEntal}`);
            this.setState({ attempts });
            this.showFadingMessage(t('question.shared.not_correct'));
        }
    }

    checkAnswer(køn, ubestemtEntal) {
        const { substantiv } = this.props;
        return(
            køn === substantiv.køn
            && ubestemtEntal.toLowerCase() === substantiv.ubestemtEntal.toLowerCase()
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
        const { t, substantiv } = this.props;

        if (this.state.showCorrectAnswer) {
            // TODO: t
            return (
                <div>
                    <p>Du svarede: {this.state.attempts.join('; ')}</p>
                    <p>Men det var faktisk: <b>{substantiv.køn} {substantiv.ubestemtEntal}</b></p>
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
                    <p><b>{substantiv.køn} {substantiv.ubestemtEntal}</b></p>
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

        const engelskArtikel = (
            substantiv.engelsk.match(/^[aeiou]/)
                ? 'an'
                : 'a'
        );

        // TODO: t

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
                    Hvordan siger man på dansk, <b>{engelskArtikel} {substantiv.engelsk}</b>?
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>Dansk:</td>
                        <td>
                            <input
                                type="text"
                                name="køn"
                                size="10"
                                value={this.state.kønValue}
                                onChange={(e) => this.handleKøn(e)}
                                autoFocus="yes"
                            />
                            &#32;
                            <input
                                type="text"
                                name="ubestemtEntal"
                                size="30"
                                value={this.state.ubestemtEntalValue}
                                onChange={(e) => this.handleChange(e, 'ubestemtEntalValue')}
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
    onResult: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
};

export default withTranslation()(QuestionForm);
