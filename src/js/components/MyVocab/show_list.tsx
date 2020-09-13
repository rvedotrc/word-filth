import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import {VocabEntry, VocabRow} from "../../words/CustomVocab/types";

import * as AppContext from "lib/app_context";

type Props = {
    vocabList: VocabEntry[];
    isDeleting: boolean;
    selectedKeys: Set<string>;
    onToggleSelected: (vocabEntry: VocabEntry) => void;
    searchText: string;
    flexMatchedKeys?: Set<string>;
} & WithTranslation

type Item = {
    vocabEntry: VocabEntry;
    vocabRow: VocabRow;
    isSelected: boolean;
    flexMatches: boolean;
}

class ShowList extends React.Component<Props, never> {

    private vocabRowIsShown(row: VocabRow) {
        const { searchText } = this.props;
        if (!searchText || searchText === '') return true;

        return(row.danskText.toLowerCase().indexOf(searchText.toLowerCase()) >= 0);
    }

    render() {
        const { t, vocabList, isDeleting, selectedKeys, onToggleSelected, flexMatchedKeys } = this.props;

        const cmp = (a: Item, b: Item) => {
            let r = a.vocabRow.sortKey.localeCompare(b.vocabRow.sortKey);
            if (r === 0) r = (a.vocabEntry.vocabKey).localeCompare(b.vocabEntry.vocabKey);
            return r;
        };

        const sortedList: Item[] = vocabList
            .map(v => ({
                vocabEntry: v,
                vocabRow: v.getVocabRow(),
                isSelected: selectedKeys.has(v.vocabKey),
            }))
            .filter(row => this.vocabRowIsShown(row.vocabRow))
            .sort(cmp)
            .map(row => ({
                ...row,
                flexMatches: !flexMatchedKeys || flexMatchedKeys.has(row.vocabEntry.vocabKey || ""),
            }));

        return (
            <table>
                <thead>
                <tr>
                    <th>{t('my_vocab.table.heading.type')}</th>
                    {isDeleting && <th/>}
                    <th>{t('my_vocab.table.heading.danish')}</th>
                    <th>{t('my_vocab.table.heading.english')}</th>
                    <th>{t('my_vocab.table.heading.details')}</th>
                    <th>{t('my_vocab.table.heading.tags')}</th>
                </tr>
                </thead>
                <tbody>
                    {sortedList.map(row => (
                        <tr
                            key={row.vocabEntry.vocabKey}
                            onDoubleClick={() => AppContext.startEditVocab(row.vocabEntry)}
                            style={{display: row.flexMatches ? "table-row" : "none"}}
                        >
                            <td>{row.vocabRow.type}</td>
                            {isDeleting && (
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={row.isSelected}
                                        onChange={() => onToggleSelected(row.vocabEntry)}
                                    />
                                </td>
                            )}
                            <td>{row.vocabRow.danskText}</td>
                            <td>{row.vocabRow.engelskText}</td>
                            <td>{row.vocabRow.detaljer}</td>
                            <td>{(row.vocabRow.tags || []).join(" ")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

}

export default withTranslation()(ShowList);
