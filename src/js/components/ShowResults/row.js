import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ShowResultsRow extends Component {
    render() {
        const { question, result } = this.props;
        return (
            <tr>
                <td>{question.resultsLabel}</td>
                <td>{question.answersLabel}</td>
                <td>{result.level || 0}</td>
                <td>{result.nextTimestamp ? new Date(result.nextTimestamp).toDateString() : 'nu'}</td>
            </tr>
        )
    }
}

ShowResultsRow.propTypes = {
    question: PropTypes.object.isRequired,
    result: PropTypes.object.isRequired
};

export default ShowResultsRow;
