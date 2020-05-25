import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import {VocabEntry, VocabRow} from "../../words/CustomVocab/types";

interface Props extends WithTranslation {
    vocabList: VocabEntry[];
    isDeleting: boolean;
    onEdit: (vocabKey: string) => void;
    selectedKeys: any;
    onToggleSelected: (vocabKey: string) => void;
    searchText: string;
}

interface Item {
    vocabItem: VocabEntry;
    vocabRow: VocabRow;
    isSelected: boolean;
}

class ShowList extends React.Component<Props, {}> {

    private showRow(row: VocabRow) {
        const { searchText } = this.props;
        if (!searchText || searchText === '') return true;

        return(row.danskText.toLowerCase().indexOf(searchText.toLowerCase()) >= 0);
    }

    render() {
        const { t, vocabList, isDeleting, selectedKeys, onToggleSelected } = this.props;

        const cmp = (a: Item, b: Item) => {
            let r = a.vocabRow.sortKey.localeCompare(b.vocabRow.sortKey);
            if (r === 0) r = a.vocabItem.vocabKey.localeCompare(b.vocabItem.vocabKey);
            return r;
        };

        const sortedList: Item[] = vocabList
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
                    {sortedList.map(row => this.showRow(row.vocabRow) && (
                        <tr key={row.vocabItem.vocabKey} onDoubleClick={() => this.props.onEdit(row.vocabItem.vocabKey)}>
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

export default withTranslation()(ShowList);
