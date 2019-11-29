import React, { Component } from "react";
import PropTypes from "prop-types";

class QuestionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            fadingMessage: null
        };
    }

    handleChange(event) {
        this.setState({ value: event.target.value.toLowerCase() });
    }

    toggleHelp() {
        this.setState({ showHelp: !this.state.showHelp });
    }

    render() {
        const { verbInfinitive } = this.props;

        if (!this.state) return null;
        const { showHelp } = this.state;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.props.onAnswer(this.state.value.trim(),
                    (value) => this.setState({ value })
                    ) }}
                onReset={(e) => { e.preventDefault(); this.props.onGiveUp() }}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"

            >
                <p>
                    Hvordan dannes verbet <b>{verbInfinitive}</b>?
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
                        e.preventDefault();
                        this.toggleHelp();
                    }}/>
                </p>
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
        )
    }
}

QuestionForm.propTypes = {
    verbInfinitive: PropTypes.string.isRequired,
    onAnswer: PropTypes.func.isRequired,
    onGiveUp: PropTypes.func.isRequired
};

export default QuestionForm;
