import React, { Component } from "react";
import PropTypes from "prop-types";

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
                    value: '',
                    firstAttempt: true,
                });
            }
        });
    }

    handleChange(event) {
        this.setState({ value: event.target.value.toLowerCase() });
    }

    handleSubmit(event) {
        event.preventDefault();
        var value = this.state.value.trim();

        if (value === '1') {
            const stem = this.state.verb.infinitiv.replace(/^at /, '');
            this.setState({ value: `${stem}r, ${stem}de, ${stem}t` });
            return;
        } else if (this.state.value.trim() === '2') {
            const stem = this.state.verb.infinitiv.replace(/^at /, '');
            const shortStem = stem.replace(/e$/, '');
            this.setState({ value: `${shortStem}er, ${shortStem}te, ${shortStem}et` });
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

    handleReset(event) {
        event.preventDefault();
        const { verb } = this.state;

        if (this.state.firstAttempt) {
            console.log('record answer for', verb.infinitiv, 'pass');
        }

        /* TODO: this message should not just fade out. Needs user interaction to dismiss. */
        this.showFadingMessage('Det var faktisk:'
            + ' ' + verb.nutid.join('/')
            + ', ' + verb.datid.join('/')
            + ', ' + verb.førnutid.join('/')
        );

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

    showFadingMessage(message) {
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
        }, 2500);
    }

    render() {
        const { verbList } = this.props;

        if (!this.state) return null;
        const { infinitiveCount, verb, showHelp, fadingMessage } = this.state;

        return (
            <div id="VerbTest" className={'message'}>
                <h2>Øv dine verber</h2>

                <p>Verber, der kan øves: {infinitiveCount}</p>

                {(infinitiveCount === 0) && (
                    <p>Der findes intet at se her lige nu :-)</p>
                )}

                {verb && (
                    <form
                        onSubmit={(e) => this.handleSubmit(e)}
                        onReset={(e) => this.handleReset(e)}
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"

                    >
                        <p>
                            Hvordan dannes verbet <b>{verb.infinitiv}</b>?
                        </p>
                        <p>
                            <input
                                type='text'
                                value={this.state.value}
                                size="50"
                                onChange={(e) => this.handleChange(e)}
                            />
                        </p>
                        <p>
                            <input type="submit" value="Svar"/>
                            <input type="reset" value="Giv op"/>
                            <input type="reset" value="Hjælp" onClick={(e) => {
                                this.toggleHelp();
                                e.preventDefault();
                            }}/>
                        </p>
                        {fadingMessage && (
                            <p key={fadingMessage}>{fadingMessage}</p>
                        )}
                        {showHelp && (
                            <div>
                                <hr/>
                                <p>
                                    Svaret skal gives i formen "nutid, datid, førnutid".
                                    Hvis man svarer "1", så bliver det udvidte til formen
                                    for gruppe 1; "2" bliver formen for gruppe 2. Så kan
                                    svaret redigeres før det sendes.
                                </p>
                                <p>
                                    fx hvis man tror at verbet er gruppe 1, så indtast "1",
                                    tryk enter, så tryk enter igen. Men hvis man tror at det
                                    er <i>næsten</i> gruppe 1, men lidt forskelligt, så indtast "1",
                                    trk enter, redig, og tryk enter igen.
                                </p>
                            </div>
                        )}
                    </form>
                )}
            </div>
        )
    }
}

// Got correct answer: hide input, show answer, suppress controls, "continue", hide fade-message
// Wrong answer: show input, show "wrong" message, fade out, remove
// Gave up: hide input, show correct answer, suppress controls, continue, hide fade-message

// hide input y/n
// hide controls y/n
// show correct answer y/n
// show "continue" y/n
// fade-message (string)

VerbTest.propTypes = {
    user: PropTypes.object.isRequired,
    verbList: PropTypes.array.isRequired
}

export default VerbTest;
