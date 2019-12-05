import React, { Component } from "react";
import PropTypes from "prop-types";

import Default from "./default";
import Substantiv from "./substantiv";
import Udtryk from "./udtryk";
// import Verbum from "./verbum";

class ShowList extends Component {

    instantiateAll() {
        const vocab = this.props.vocab;
        const handlers = {
            udtryk: Udtryk,
            substantiv: Substantiv,
            // verbum: Verbum,
        };

        return Object.keys(vocab)
            .map(dbKey => {
                const data = vocab[dbKey];
                const handler = handlers[data.type] || Default;
                return new handler(dbKey, data);
            });
    }

    render() {
        const { isDeleting, selectedKeys, onToggleSelected } = this.props;

        const cmp = (a, b) => {
            if (a.sortKey < b.sortKey) return -1;
            if (a.sortKey > b.sortKey) return +1;
            if (a.dbKey > b.dbKey) return +1;
            if (a.dbKey < b.dbKey) return -1;
            return 0;
        };

        const vocabRows = this.instantiateAll()
            .sort(cmp)
            .map(t => t.asVocabEntry({ isDeleting, isSelected: !!selectedKeys[t.dbKey], onToggleSelected }));

        return (
            <table>
                <thead>
                <tr>
                    <th>Type</th>
                    {isDeleting && <th/>}
                    <th>Dansk</th>
                    <th>Engelsk</th>
                    <th>Detaljer</th>
                </tr>
                </thead>
                <tbody>
                    {vocabRows}
                </tbody>
            </table>
        )
    }
}

ShowList.propTypes = {
    vocab: PropTypes.object.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    selectedKeys: PropTypes.object.isRequired,
    onToggleSelected: PropTypes.func.isRequired
};

export default ShowList;
