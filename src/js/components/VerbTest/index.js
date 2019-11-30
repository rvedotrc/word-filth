import React, { Component } from "react";
import PropTypes from "prop-types";

import QuestionForm from "./question_form.js";
import ReviewCorrectAnswer from "./review_correct_answer.js";
import SpacedRepetition from "../../SpacedRepetition";

class VerbTest extends Component {
    componentDidMount() {
        this.state = {
            showHelp: false,
            fadingMessage: null
        };
        this.nextQuestion();
    }

    nextQuestion() {
        const { verbList } = this.props;

        const ref = firebase.database().ref(`users/${this.props.user.uid}/results`);
        ref.once('value').then(snapshot => {
            const db = snapshot.val() || {};

            const now = new Date().getTime();

            const candidateVerbs = verbList.filter(verb => {
                // return true;
                const key = "verb-infinitiv-" + verb.infinitiv.replace(/^at /, '');
                return !db[key] || !db[key].nextTimestamp || now > db[key].nextTimestamp;
            });

            const seen = {};
            const unseen = key => {
                if (seen[key]) return false;
                seen[key] = true;
                return true;
            };
            this.setState({ infinitiveCount: candidateVerbs.filter(v => unseen(v.infinitiv)).length });

            if (candidateVerbs.length === 0) {
                this.setState({
                    verb: null
                });
            } else {
                const verb = candidateVerbs[Math.floor(Math.random() * candidateVerbs.length)];
                this.setState({
                    verb: verb,
                    answering: true,
                    firstAttempt: true,
                });
            }
        });
    }

    handleChange(event) {
        this.setState({ value: event.target.value.toLowerCase() });
    }

    onAnswer(value, setValue) {
        if (value === '1') {
            const stem = this.state.verb.infinitiv.replace(/^at /, '');
            const newValue = `${stem}r, ${stem}de, ${stem}t`;
            setValue(newValue);
            return;
        } else if (value === '2') {
            const stem = this.state.verb.infinitiv.replace(/^at /, '');
            const shortStem = stem.replace(/e$/, '');
            const newValue = `${shortStem}er, ${shortStem}te, ${shortStem}et`;
            setValue(newValue);
            return;
        }

        const match = value.match(/^(\S+), *(\S+), *(\S+)$/);
        if (!match) {
            this.showFadingMessage("Svaret skal gives i formen: nutid, datid, førnutid");
            return;
        }

        const isCorrect = this.checkAnswer(
            this.state.verb,
            match[1], match[2], match[3]
        );

        if (this.state.firstAttempt) {
            this.recordAnswer(this.state.verb, isCorrect);
            this.setState({ firstAttempt: false });
        }

        if (isCorrect) {
            this.showFadingMessage("Lige præcis!");
            this.nextQuestion();
        } else {
            this.showFadingMessage(`Næ, det er ikke ${value}`);
        }
    }

    recordAnswer(verb, isCorrect) {
        return new SpacedRepetition(
            this.props.user,
            "verb-infinitiv-" + verb.infinitiv.replace(/^at /, '')
        ).recordAnswer(isCorrect);
    }

    onGiveUp() {
        const { verb } = this.state;

        if (this.state.firstAttempt) {
            console.log('record answer for', verb.infinitiv, 'pass');
        }

        this.setState({ answering: false });
    }

    dismissCorrectAnswer() {
        this.nextQuestion();
    }

    checkAnswer(chosenVerb, givetNutid, givetDatid, givetFørnutid) {
        // We'll be forgiving shall we?
        return this.props.verbList.some(verb => {
            if (verb.infinitiv !== chosenVerb.infinitiv) return false;

            return (verb.nutid.includes(givetNutid)
              && verb.datid.includes(givetDatid)
              && verb.førnutid.includes(givetFørnutid));
        });
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
        const { verbList } = this.props;

        if (!this.state) return null;
        const { infinitiveCount, verb, answering, showHelp, fadingMessage } = this.state;

        return (
            <div id="VerbTest" className={'message'}>
                <h2>Øv dine verber</h2>

                <p>Verber, der kan øves: {infinitiveCount}</p>

                {(infinitiveCount === 0) && (
                    <p>Der findes intet at se her lige nu :-)</p>
                )}

                {verb && answering && (
                    <QuestionForm
                        key={verb.infinitiv}
                        verbInfinitive={verb.infinitiv}
                        onAnswer={(answer, setValue) => this.onAnswer(answer, setValue)}
                        onGiveUp={() => this.onGiveUp()}
                    />
                )}

                {verb && !answering && (
                    <ReviewCorrectAnswer
                        verb={verb}
                        onClose={() => this.dismissCorrectAnswer()}
                    />
                )}

                {fadingMessage && (
                    <p key={fadingMessage}>{fadingMessage}</p>
                )}
            </div>
        )
    }
}

VerbTest.propTypes = {
    user: PropTypes.object.isRequired,
    verbList: PropTypes.array.isRequired
};

export default VerbTest;
