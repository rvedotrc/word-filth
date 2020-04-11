import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class ShowResultsRow extends Component {
    render() {
        const { t, question, result } = this.props;
        return (
            <tr>
                {this.props.showDebug && <td>
                    {question.resultsKey}
                </td>}
                {this.props.showDebug && <td>
                    <button onClick={() => this.props.openModal(question)}>Q</button>
                </td>}
                <td>{question.resultsLabel}</td>
                <td>{question.answersLabel}</td>
                <td>{result.level || 0}</td>
                <td>{result.history ? result.history.length : 0}</td>
                <td>{result.nextTimestamp
                    ? new Date(result.nextTimestamp).toDateString()
                    : t('show_results.table.body.now')
                }</td>
            </tr>
        )
    }
}

ShowResultsRow.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    question: PropTypes.object.isRequired,
    result: PropTypes.object.isRequired,
    showDebug: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
};

export default withTranslation()(ShowResultsRow);
