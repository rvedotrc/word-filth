import React, { Component } from "react";
import PropTypes from "prop-types";

class ShowVerbListRow extends Component {
    render() {
        const { verb } = this.props;

        const ddoLink = `https://ordnet.dk/ddo/ordbog?query=${escape(verb.infinitiv.replace(/^at /, ''))}`;

        return (
            <tr>
                <td><a href={ddoLink}>{verb.infinitiv}</a></td>
                <td>{verb.imperativ}</td>
                <td>{verb.nutid.join(' / ')}</td>
                <td>{verb.datid.join(' / ')}</td>
                <td>{verb.førnutid.join(' / ')}</td>
            </tr>
        )
    }
}

ShowVerbListRow.propTypes = {
    verb: PropTypes.object.isRequired
}

export default ShowVerbListRow;
