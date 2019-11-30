import React, { Component } from "react";
import PropTypes from "prop-types";

class ReviewCorrectAnswer extends Component {
    render() {
        const { verb } = this.props;
        const answer = verb.nutid.map(t => `<b>${t}</b>`).join(' eller ')
            + ', ' + verb.datid.map(t => `<b>${t}</b>`).join(' eller ')
            + ', ' + verb.førnutid.map(t => `<b>${t}</b>`).join(' eller ');

        const ddoLink = `https://ordnet.dk/ddo/ordbog?query=${escape(verb.infinitiv.replace(/^at /, ''))}`;

        return (
            <div>
                <p>
                    Det var faktisk: <span dangerouslySetInnerHTML={{__html: answer}}/>
                </p>
                <p>
                    <a href={ddoLink}>Leæs mere på DDO</a>
                </p>
                <button
                    autoFocus={'yes'}
                    onClick={this.props.onClose}
                >Fortsæt</button>
            </div>
        )
    }
}

ReviewCorrectAnswer.propTypes = {
    verb: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ReviewCorrectAnswer;
