import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import ExternalLinker from '../../shared/external_linker';
import {Verb} from "../../words/BuiltInVerbs/types";

interface Props extends WithTranslation {
    verb: Verb;
}

class ShowVerbListRow extends React.Component<Props, {}> {
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

export default withTranslation()(ShowVerbListRow);
