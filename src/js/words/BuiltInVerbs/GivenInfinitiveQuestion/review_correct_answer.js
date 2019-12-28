import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import ExternalLinker from '../../../shared/external_linker';
import ShowCorrectAnswers from './show_correct_answers';

class ReviewCorrectAnswer extends Component {
    allAttempts() {
        const { attempts } = this.props;
        if (attempts.length === 0) return '-';

        return attempts
            .map(attempt => <span>
                {attempt.nutid}, {attempt.datid}, {attempt.førnutid}
            </span>)
            .reduce((prev, curr) => [prev, <br/>, 'så: ', curr])
    }

    render() {
        const { infinitive, verbs } = this.props;

        // TODO: norsk
        const ddoLink = ExternalLinker.toDDO(infinitive.replace(/^at /, ''));
        const gtLink = ExternalLinker.toGoogleTranslate(infinitive);

        // TODO: style the button
        // TODO: t

        return (
            <div>
                <p>
                    Du svarede: {this.allAttempts()}
                </p>
                <p>
                    Det var faktisk: {new ShowCorrectAnswers(verbs).allAnswers()}
                </p>
                <p>
                    <a href={ddoLink}>Leæs mere på DDO</a>
                    <span style={{marginLeft: '0.7em', marginRight: '0.7em'}}>|</span>
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
