import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import ExternalLinker from '../../shared/external_linker';

class ShowVerbListRow extends Component {
    render() {
        const { verb } = this.props;

        // TODO: norsk? At the moment the built-in verbs are all Danish.
        const ddoLink = ExternalLinker.toDDO(verb.infinitiv.replace(/^at /, ''));
        const gtLink = ExternalLinker.toGoogleTranslate(verb.infinitiv);

        return (
            <tr>
                <td><a href={ddoLink}>{verb.infinitiv}</a></td>
                <td>{verb.nutid.join(' / ')}</td>
                <td>{verb.datid.join(' / ')}</td>
                <td>{verb.førnutid.join(' / ')}</td>
                <td>{verb.engelsk}</td>
                <td><a href={gtLink}>&#x2194;</a></td>
            </tr>
        )
    }
}

ShowVerbListRow.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    verb: PropTypes.object.isRequired
};

export default withTranslation()(ShowVerbListRow);
