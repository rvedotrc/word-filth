import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class ShowList extends Component {
    render() {
        const { t, vocabList, isDeleting, selectedKeys, onToggleSelected } = this.props;

        const cmp = (a, b) => {
            let r = a.vocabRow.sortKey.localeCompare(b.vocabRow.sortKey);
            if (r === 0) r = a.vocabItem.vocabKey.localeCompare(b.vocabItem.vocabKey);
            return r;
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
                    <th>{t('my_vocab.table.heading.type')}</th>
                    {isDeleting && <th/>}
                    <th>{t('my_vocab.table.heading.danish')}</th>
                    <th>{t('my_vocab.table.heading.english')}</th>
                    <th>{t('my_vocab.table.heading.details')}</th>
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

export default withTranslation()(ShowList);
