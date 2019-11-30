import React, { Component } from "react";
import PropTypes from "prop-types";

class QuestionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nutidValue: '',
            datidValue: '',
            førnutidValue: ''
        };
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    toggleHelp() {
        this.setState({ showHelp: !this.state.showHelp });
    }

    onSubmit() {
        this.props.onAnswer(
            {
                nutid: this.state.nutidValue.trim(),
                datid: this.state.datidValue.trim(),
                førnutid: this.state.førnutidValue.trim()
            },
            (newValues) => {
                this.setState({
                    nutidValue: newValues.nutid,
                    datidValue: newValues.datid,
                    førnutidValue: newValues.førnutid
                });
            }
        );
    }

    render() {
        const { verbInfinitive } = this.props;

        if (!this.state) return null;
        const { showHelp } = this.state;

        const ddoLink = `https://ordnet.dk/ddo/ordbog?query=${escape(verbInfinitive.replace(/^at /, ''))}`;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onSubmit(); }}
                onReset={(e) => { e.preventDefault(); this.props.onGiveUp(); }}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"

            >
                <p>
                    Hvordan dannes verbet <a href={ddoLink}>{verbInfinitive}</a>?
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
                {showHelp && (
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
            </form>
        )
    }
}

QuestionForm.propTypes = {
    verbInfinitive: PropTypes.string.isRequired,
    onAnswer: PropTypes.func.isRequired,
    onGiveUp: PropTypes.func.isRequired
};

export default QuestionForm;
