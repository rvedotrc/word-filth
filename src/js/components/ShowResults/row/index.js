import React, { Component } from "react";
import PropTypes from "prop-types";

class ShowResultsRow extends Component {
    render() {
        const { resultKey, resultValue } = this.props;
        return (
            <tr>
                <td>{resultKey}</td>
                <td>{resultValue.level || 0}</td>
                <td>{resultValue.nextTimestamp ? new Date(resultValue.nextTimestamp).toDateString() : 'nu'}</td>
                {/*<td>${JSON.stringify(resultValue.history, null, 2)}</td>*/}
            </tr>
        )
    }
}

ShowResultsRow.propTypes = {
    resultKey: PropTypes.string.isRequired,
    resultValue: PropTypes.object.isRequired
};

export default ShowResultsRow;
