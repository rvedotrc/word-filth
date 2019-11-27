import React, { Component } from "react";
import PropTypes from "prop-types";

class VerbTest extends Component {
    componentDidMount() {
        this.nextQuestion();
    }

    nextQuestion() {
        const { verbList } = this.props;
        const verb = verbList[Math.floor(Math.random() * verbList.length)];

        this.setState({
            verb: verb,
            value: '',
            firstAttempt: true
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
            console.log('Not the right format in', value);
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
            console.log('Lige præcis!', value, 'er rigtigt!');
            this.nextQuestion();
        } else {
            console.log('Næ, det er ikke', value);
        }
    }

    handleReset(event) {
        event.preventDefault();
        const { verb } = this.state;

        if (this.state.firstAttempt) {
            console.log('record answer for', verb.infinitiv, 'pass');
        }

        console.log('Det var faktisk:',
            verb.nutid.join('/'),
            verb.datid.join('/'),
            verb.førnutid.join('/')
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

    render() {
        const { verbList } = this.props;

        if (!this.state) return null;
        const { verb } = this.state;
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
                    </p>
                </form>
            </div>
        )
    }
}

VerbTest.propTypes = {
    user: PropTypes.object.isRequired,
    verbList: PropTypes.array.isRequired
}

export default VerbTest;
