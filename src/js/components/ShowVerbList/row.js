import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExternalLinker from '../../external_linker';

class ShowVerbListRow extends Component {
    render() {
        const { verb } = this.props;

        const ddoLink = ExternalLinker.toDDO(verb.infinitiv.replace(/^at /, ''));
        const gtLink = ExternalLinker.toGoogleTranslate(verb.infinitiv);

        return (
            <tr>
                <td><a href={ddoLink}>{verb.infinitiv}</a></td>
                <td>{verb.nutid.join(' / ')}</td>
                <td>{verb.datid.join(' / ')}</td>
                <td>{verb.førnutid.join(' / ')}</td>
                <td><a href={gtLink}>&#x2194;</a></td>
            </tr>
        )
    }
}

ShowVerbListRow.propTypes = {
    verb: PropTypes.object.isRequired
};

export default ShowVerbListRow;
