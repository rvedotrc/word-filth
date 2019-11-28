import React, { Component } from "react";
import PropTypes from "prop-types";

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
        const verb = verbList[Math.floor(Math.random() * verbList.length)];

        this.setState({
            verb: verb,
            value: '',
            firstAttempt: true,
        });
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
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
            console.log('record answer for', this.state.verb.infinitiv, 'isCorrect', isCorrect);
            this.setState({ firstAttempt: false });
        }

        if (isCorrect) {
            this.showFadingMessage("Lige præcis!");
            this.nextQuestion();
        } else {
            this.showFadingMessage(`Næ, det er ikke ${value}`);
        }
    }

    handleReset(event) {
        event.preventDefault();
        const { verb } = this.state;

        if (this.state.firstAttempt) {
            console.log('record answer for', verb.infinitiv, 'pass');
        }

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
        const { verb, showHelp, fadingMessage } = this.state;
        if (!verb) return null;

        return (
            <div id="VerbTest" className={'message'}>
                <h2>Øv dine verber</h2>

                <form
                    onSubmit={(e) => this.handleSubmit(e)}
                    onReset={(e) => this.handleReset(e)}
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
