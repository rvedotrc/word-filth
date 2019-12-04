import React, { Component } from "react";
import PropTypes from "prop-types";

import QuestionForm from "./question_form.js";
import ReviewCorrectAnswer from "./review_correct_answer.js";
import SpacedRepetition from "../../SpacedRepetition";

class VerbTest extends Component {
    componentDidMount() {
        this.state = {
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

            const infinitives = {};
            candidateVerbs.map(v => { infinitives[v.infinitiv] = true });
            const candidateInfinitives = Object.keys(infinitives);

            this.setState({ infinitiveCount: candidateInfinitives.length });

            if (candidateInfinitives.length === 0) {
                this.setState({
                    currentInfinitive: null
                });
            } else {
                const selectedInfinitive = candidateInfinitives[
                    Math.floor(Math.random() * candidateInfinitives.length)
                ];
                const verbs = verbList.filter(v => v.infinitiv === selectedInfinitive);

                this.setState({
                    currentInfinitive: selectedInfinitive,
                    matchingVerbs: verbs,
                    answering: true,
                    firstAttempt: true,
                    attempts: [],
                });
            }
        });
    }

    handleChange(event) {
        this.setState({ value: event.target.value.toLowerCase() });
    }

    onAnswer(values, setValues) {
        const { currentInfinitive, matchingVerbs, firstAttempt } = this.state;

        const shortStem = currentInfinitive.replace(/^at /, '').replace(/e$/, '');

        if (values.nutid === '1') {
            setValues({
                nutid: `${shortStem}er`,
                datid: `${shortStem}ede`,
                førnutid: `${shortStem}et`
            });
            return;
        } else if (values.nutid === '2') {
            setValues({
                nutid: `${shortStem}er`,
                datid: `${shortStem}te`,
                førnutid: `${shortStem}t`
            });
            return;
        }

        if (!(
            values.nutid.match(/^(\S+)$/) &&
            values.datid.match(/^(\S+)$/) &&
            values.førnutid.match(/^(\S+)$/)
        )) {
            this.showFadingMessage("Både nutid og datid og førnutid skal udfyldes");
            return;
        }

        const isCorrect = this.checkAnswer(
            values.nutid, values.datid, values.førnutid
        );

        if (firstAttempt) {
            this.recordAnswer(currentInfinitive, isCorrect);
            this.setState({ firstAttempt: false });
        }

        if (isCorrect) {
            this.showFadingMessage("Lige præcis!");
            this.nextQuestion();
        } else {
            const attempts = this.state.attempts.concat(values);
            this.setState({ attempts });
            this.showFadingMessage(`Næ, det er det ikke`);
        }
    }

    recordAnswer(infinitive, isCorrect) {
        return new SpacedRepetition(
            this.props.user,
            "verb-infinitiv-" + infinitive.replace(/^at /, '')
        ).recordAnswer(isCorrect);
    }

    onGiveUp() {
        const { currentInfinitive, firstAttempt } = this.state;

        if (firstAttempt) {
            console.log('record answer for', currentInfinitive, 'pass');
        }

        this.setState({ answering: false });
    }

    dismissCorrectAnswer() {
        this.nextQuestion();
    }

    checkAnswer(givetNutid, givetDatid, givetFørnutid) {
        return this.state.matchingVerbs.some(verb => {
            return (verb.nutid.includes(givetNutid)
              && verb.datid.includes(givetDatid)
              && verb.førnutid.includes(givetFørnutid));
        });
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
        if (!this.state) return null;
        const { infinitiveCount, currentInfinitive, answering, fadingMessage } = this.state;

        return (
            <div id="VerbTest" className={'message'}>
                <h2>Øv Dine Verber</h2>

                <p>Verber, der kan øves: {infinitiveCount}</p>

                {(infinitiveCount === 0) && (
                    <p>Der findes intet at se her lige nu :-)</p>
                )}

                {currentInfinitive && answering && (
                    <QuestionForm
                        key={currentInfinitive}
                        verbInfinitive={currentInfinitive}
                        onAnswer={(answers, setValues) => this.onAnswer(answers, setValues)}
                        onGiveUp={() => this.onGiveUp()}
                    />
                )}

                {currentInfinitive && !answering && (
                    <ReviewCorrectAnswer
                        infinitive={currentInfinitive}
                        verbs={this.state.matchingVerbs}
                        attempts={this.state.attempts}
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
