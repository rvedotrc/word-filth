import React, { Component } from 'react';

import BuiltInVerbs from '../../words/BuiltInVerbs';
import ShowVerbListRow from './row';

class ShowVerbList extends Component {
    render() {
        const verbs = [];
        BuiltInVerbs.getAll().map(q => verbs.push.apply(verbs, q.verbs));

        const sortedVerbs = verbs.sort((a, b) => {
            let r = a.infinitiv.localeCompare(b.infinitiv);
            if (r === 0) r = a.tekst.localeCompare(b.tekst);
            return r;
        });

        return (
            <div>
                <h2>List af Verber</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Infinitiv</th>
                            <th>Nutid</th>
                            <th>Datid</th>
                            <th>Førnutid</th>
                            <th>Engelsk</th>
                            <th>Læs mere</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedVerbs.map((verb, index) => (
                            <ShowVerbListRow verb={verb} key={verb.tekst}/>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ShowVerbList;
