import React, { Component } from 'react';
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
            this.showFadingMessage("Både nutid og datid og førnutid skal udfyldes");
            return;
        }

        const isCorrect = this.checkAnswer(nutid, datid, førnutid);
        this.props.onResult(isCorrect);

        if (isCorrect) {
            this.setState({ showPraise: true });
        } else {
            const attempts = this.state.attempts.concat({ nutid, datid, førnutid });
            this.setState({ attempts });
            this.showFadingMessage('Næ, det er det ikke');
        }
    }

    autoFill(nutid, datid, førnutid) {
        const shortStem = this.props.question.infinitive
            .replace(/^at /, '')
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
                <ReviewCorrectAnswer
                    infinitive={this.props.question.infinitive}
                    verbs={this.props.question.verbs}
                    attempts={this.state.attempts}
                    onClose={this.props.onDone}
                />
            );
        }

        if (this.state.showPraise) {
            return (
                <div>
                    <p>Lige præcis!</p>
                    <p>
                        {new ShowCorrectAnswers(this.props.question.verbs).allAnswers()}
                    </p>
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

        const verbInfinitive = this.props.question.infinitive;
        const { fadingMessage } = this.state;

        const ddoLink = ExternalLinker.toDDO(verbInfinitive.replace(/^at /, ''));
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
                    Hvordan dannes verbet <a href={ddoLink}>{verbInfinitive}</a>?
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
                        <td>Nutid:</td>
                        <td><input
                            value={this.state.nutidValue}
                            size="20"
                            autoFocus="yes"
                            onChange={(e) => this.handleChange(e, 'nutidValue')}
                        /></td>
                    </tr>
                    <tr>
                        <td>Datid:</td>
                        <td><input
                            value={this.state.datidValue}
                            size="20"
                            onChange={(e) => this.handleChange(e, 'datidValue')}
                        /></td>
                    </tr>
                    <tr>
                        <td>Førnutid:</td>
                        <td><input
                            value={this.state.førnutidValue}
                            size="20"
                            onChange={(e) => this.handleChange(e, 'førnutidValue')}
                        /></td>
                    </tr>
                    </tbody>
                </table>

                <p>
                    <input type="submit" value="Svar"/>
                    <input type="reset" value="Giv op"/>
                    <input type="reset" value="Hjælp" onClick={(e) => {
                        e.preventDefault();
                        this.toggleHelp();
                    }}/>
                </p>

                {this.state.showHelp && (
                    <div>
                        <hr/>
                        <p>
                            Hvis man svarer "1" til nutid, så bliver det udvidte til formen
                            for gruppe 1; "2" bliver formen for gruppe 2. Så kan
                            svaret redigeres før det sendes.
                        </p>
                        <p>
                            fx hvis man tror at verbet er gruppe 1, så indtast "1",
                            tryk enter, så tryk enter igen. Men hvis man tror at det
                            er <i>næsten</i> gruppe 1, men lidt forskelligt, så indtast "1",
                            trk enter, redig, så tryk enter igen.
                        </p>
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
    question: PropTypes.object.isRequired,
    onResult: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
};

export default QuestionForm;
