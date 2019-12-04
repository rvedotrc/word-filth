import React, { Component } from "react";
import PropTypes from "prop-types";

import ExternalLinker from "../../external_linker";

class ReviewCorrectAnswer extends Component {
    render() {
        const { infinitive, verbs, attempts } = this.props;

        const allAttempts = attempts
            .map(attempt => `${attempt.nutid}, ${attempt.datid}, ${attempt.førnutid}`)
            .join('; ');

        const answers = verbs.map(verb => {
            return verb.nutid.map(t => `<b>${t}</b>`).join(' eller ')
            + ', ' + verb.datid.map(t => `<b>${t}</b>`).join(' eller ')
            + ', ' + verb.førnutid.map(t => `<b>${t}</b>`).join(' eller ');
        }).sort();

        const allAnswers = answers.sort().join('; eller ');

        const ddoLink = ExternalLinker.toDDO(infinitive.replace(/^at /, ''));
        const gtLink = ExternalLinker.toGoogleTranslate(infinitive);

        return (
            <div>
                <p>
                    Du svarede: {allAttempts}
                </p>
                <p>
                    Det var faktisk: <span dangerouslySetInnerHTML={{__html: allAnswers}}/>
                </p>
                <p>
                    <a href={ddoLink}>Leæs mere på DDO</a>
                    |
                    <a href={gtLink}>Oversæt på Google</a>
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
    infinitive: PropTypes.string.isRequired,
    verbs: PropTypes.array.isRequired,
    attempts: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ReviewCorrectAnswer;
