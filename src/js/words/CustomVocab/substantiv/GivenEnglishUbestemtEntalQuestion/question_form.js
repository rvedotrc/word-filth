import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import GenderInput from "../../../../components/shared/gender_input";

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

    handleKøn(value) {
        this.setState({ kønValue:  value });
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    onAnswer() {
        const { t } = this.props;
        const køn = this.state.kønValue;
        const ubestemtEntal = this.state.ubestemtEntalValue.trim().toLowerCase();

        if (!køn || ubestemtEntal === '') {
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
            return (
                <div>
                    <p>
                        {t('question.shared.wrong.you_answered')}{' '}
                        {this.state.attempts.join('; ')}
                    </p>
                    <p>
                        {t('question.shared.wrong.but_it_was')}{' '}
                        <b>{substantiv.køn} {substantiv.ubestemtEntal}</b>
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
                    {t('question.shared.how_do_you_say_in_danish', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        english: <b key="engelsk">{engelskArtikel} {substantiv.engelsk}</b>,
                    })}
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{t('question.shared.label.danish')}</td>
                        <td>
                            <span style={{margin: 'auto 0.5em'}}>
                                <GenderInput
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

QuestionForm.propTypes = {
    substantiv: PropTypes.object.isRequired,
    onResult: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
};

export default withTranslation()(QuestionForm);
