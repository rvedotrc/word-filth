import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import ExternalLinker from '../../../shared/external_linker';
import ReviewCorrectAnswer from './review_correct_answer';
import ShowCorrectAnswers from "./show_correct_answers";

class QuestionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nutidValue: '',
            datidValue: '',
            førnutidValue: '',

            attempts: [],

            showHelp: false,
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

        if (this.state.nutidValue.trim() === '1') {
            this.autoFill('er', 'ede', 'et');
            return;
        }

        if (this.state.nutidValue.trim() === '2') {
            this.autoFill('er', 'te', 't');
            return;
        }

        const nutid = this.state.nutidValue.trim().toLowerCase();
        const datid = this.state.datidValue.trim().toLowerCase();
        const førnutid = this.state.førnutidValue.trim().toLowerCase();

        if (!(nutid.match(/^\S+$/) && datid.match(/^\S+$/) && førnutid.match(/^\S+$/))) {
            this.showFadingMessage(t('question.builtin_verb.given_infinitive.all_forms_required'));
            return;
        }

        const isCorrect = this.checkAnswer(nutid, datid, førnutid);
        this.props.onResult(isCorrect);

        if (isCorrect) {
            this.setState({ showPraise: true });
        } else {
            const attempts = this.state.attempts.concat({ nutid, datid, førnutid });
            this.setState({ attempts });
            this.showFadingMessage(t('question.shared.not_correct'));
        }
    }

    autoFill(nutid, datid, førnutid) {
        const shortStem = this.props.question.infinitive
            .replace(/^(at|å) /, '')
            .replace(/e$/, '');
        this.setState({
            nutidValue: shortStem + nutid,
            datidValue: shortStem + datid,
            førnutidValue: shortStem + førnutid,
        });
    }

    checkAnswer(givetNutid, givetDatid, givetFørnutid) {
        return this.props.question.verbs.some(verb => {
            return (verb.nutid.includes(givetNutid)
                && verb.datid.includes(givetDatid)
                && verb.førnutid.includes(givetFørnutid));
        });
    }

    onGiveUp() {
        this.props.onResult(false);
        this.setState({ showCorrectAnswer: true });
    }

    toggleHelp() {
        this.setState({ showHelp: !this.state.showHelp });
    }

    showFadingMessage(message, timeout) {
        this.setState({ fadingMessage: message });
        const t = this;
        window.setTimeout(() => {
            t.setState(prevState => {
                if (prevState.fadingMessage === message) {
                    return({ fadingMessage: null });
                } else {
                    return {};
                }
            });
        }, timeout || 2500);
    }

    render() {
        const { t } = this.props;

        if (this.state.showCorrectAnswer) {
            return (
                <ReviewCorrectAnswer
                    // FIXME: why do we need to pass i18n and t here, for testing?
                    i18n={this.props.i18n}
                    t={this.props.t}
                    infinitive={this.props.question.infinitive}
                    verbs={this.props.question.verbs}

                    hasGimme={this.props.hasGimme}
                    gimmeUsed={this.props.gimmeUsed}

                    attempts={this.state.attempts}
                    onGimme={this.props.onGimme}
                    onClose={this.props.onDone}
                />
            );
        }

        if (this.state.showPraise) {
            // TODO: norsk? At the moment the built-in verbs are all Danish.
            const infinitive = this.props.question.infinitive;
            const ddoLink = ExternalLinker.toDDO(infinitive.replace(/^(at|å) /, ''));
            const gtLink = ExternalLinker.toGoogleTranslate(infinitive);

            return (
                <div>
                    <p>{t('question.shared.correct')}</p>
                    <p>
                        {new ShowCorrectAnswers(this.props.question.verbs).allAnswers()}
                    </p>
                    <p>
                        <a href={ddoLink}>{t('question.builtin_verb.given_infinitive.read_more_at_ddo')}</a>
                        <span style={{marginLeft: '0.7em', marginRight: '0.7em'}}>|</span>
                        <a href={gtLink}>{t('question.builtin_verb.given_infinitive.translate_with_google')}</a>
                    </p>
                    <p>
                        <input
                            type="button"
                            value={t('question.shared.continue.button')}
                            onClick={this.props.onDone}
                            autoFocus="yes"
                        />
                        {this.props.hasGimme && (
                            <input
                                type="button"
                                value={t('question.shared.gimme.button')}
                                disabled={this.props.gimmeUsed}
                                onClick={this.props.onGimme}
                                data-test-id="gimme"
                                className="gimme"
                            />
                        )}
                    </p>
                </div>
            );
        }

        const verbInfinitive = this.props.question.infinitive;
        const { fadingMessage } = this.state;

        // TODO: norsk? At the moment the built-in verbs are all Danish.
        const ddoLink = ExternalLinker.toDDO(verbInfinitive.replace(/^(at|å) /, ''));
        const gtLink = ExternalLinker.toGoogleTranslate(verbInfinitive);

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
                    {t('question.builtin_verb.given_infinitive.question', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        infinitive: <a key="ddoLink" href={ddoLink}>{verbInfinitive}</a>,
                    })}
                    {this.props.question.engelsk && (
                        <span style={{marginLeft: '0.3em'}}>({this.props.question.engelsk})</span>
                    )}
                    <span style={{marginLeft: '0.75em'}}>
                        <a href={gtLink}>&#x2194;</a>
                    </span>
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{t('question.builtin_verb.given_infinitive.nutid.label')}</td>
                        <td><input
                            value={this.state.nutidValue}
                            size="20"
                            autoFocus="yes"
                            data-test-id="nutid"
                            onChange={(e) => this.handleChange(e, 'nutidValue')}
                        /></td>
                    </tr>
                    <tr>
                        <td>{t('question.builtin_verb.given_infinitive.datid.label')}</td>
                        <td><input
                            value={this.state.datidValue}
                            size="20"
                            data-test-id="datid"
                            onChange={(e) => this.handleChange(e, 'datidValue')}
                        /></td>
                    </tr>
                    <tr>
                        <td>{t('question.builtin_verb.given_infinitive.førnutid.label')}</td>
                        <td><input
                            value={this.state.førnutidValue}
                            size="20"
                            data-test-id="førnutid"
                            onChange={(e) => this.handleChange(e, 'førnutidValue')}
                        /></td>
                    </tr>
                    </tbody>
                </table>

                <p>
                    <input type="submit" value={t('question.shared.answer.button')}/>
                    <input type="reset" value={t('question.shared.give_up.button')}/>
                    <input type="button" value={t('question.shared.skip.button')} onClick={this.props.onDone}/>
                    <input type="reset" value={t('question.shared.help.button')} onClick={(e) => {
                        e.preventDefault();
                        this.toggleHelp();
                    }}/>
                </p>

                {this.state.showHelp && (
                    <div>
                        <hr/>
                        <p>{t('question.builtin_verb.given_infinitive.help_1')}</p>
                        <p>{t('question.builtin_verb.given_infinitive.help_2')}</p>
                    </div>
                )}

                {fadingMessage && (
                    <p key={fadingMessage}>{fadingMessage}</p>
                )}
            </form>
        );
    }
}

QuestionForm.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    question: PropTypes.object.isRequired,

    // canAnswer: PropTypes.bool.isRequired,
    hasGimme: PropTypes.bool.isRequired,
    gimmeUsed: PropTypes.bool.isRequired,

    onResult: PropTypes.func.isRequired,
    onGimme: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
};

export default withTranslation()(QuestionForm);
