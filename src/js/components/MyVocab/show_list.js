import React, { Component } from "react";
import PropTypes from "prop-types";

class ShowList extends Component {
    render() {
        const { vocabList, isDeleting, selectedKeys, onToggleSelected } = this.props;

        const cmp = (a, b) => {
            if (a.vocabRow.sortKey < b.vocabRow.sortKey) return -1;
            if (a.vocabRow.sortKey > b.vocabRow.sortKey) return +1;
            if (a.vocabItem.vocabKey < b.vocabItem.vocabKey) return -1;
            if (a.vocabItem.vocabKey > b.vocabItem.vocabKey) return +1;
            return 0;
        };

        const sortedList = vocabList
            .map(v => ({
                vocabItem: v,
                vocabRow: v.getVocabRow(),
                isSelected: !!selectedKeys[v.vocabKey],
            }))
            .sort(cmp);

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
                    {sortedList.map(row => (
                        <tr key={row.vocabItem.vocabKey}>
                            <td>{row.vocabRow.type}</td>
                            {isDeleting && (
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={row.isSelected}
                                        onChange={() => onToggleSelected(row.vocabItem.vocabKey)}
                                    />
                                </td>
                            )}
                            <td>{row.vocabRow.danskText}</td>
                            <td>{row.vocabRow.engelskText}</td>
                            <td>{row.vocabRow.detaljer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }
}

ShowList.propTypes = {
    vocabList: PropTypes.array.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    selectedKeys: PropTypes.object.isRequired,
    onToggleSelected: PropTypes.func.isRequired
};

export default ShowList;
