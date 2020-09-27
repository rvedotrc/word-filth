import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import {VocabEntry, VocabRow} from "../../words/CustomVocab/types";

import Row from "@components/MyVocab/row";
import {VocabListItem} from "@components/MyVocab/page";

type Props = {
    vocabList: VocabListItem[];
    isDeleting: boolean;
    selectedKeys: Set<string>;
    onToggleSelected: (vocabEntry: VocabEntry) => void;
    flexMatchedKeys?: Set<string>;
} & WithTranslation

type AggregateItem = {
    vocabEntry: VocabEntry;
    vocabRow: VocabRow;
    isSelected: boolean;
    flexMatches: boolean;
}

const ShowList = (props: Props) => {

    const { t, vocabList, isDeleting, selectedKeys, onToggleSelected, flexMatchedKeys } = props;

    const cmp = (a: AggregateItem, b: AggregateItem) => {
        let r = a.vocabRow.sortKey.localeCompare(b.vocabRow.sortKey);
        if (r === 0) r = (a.vocabEntry.vocabKey).localeCompare(b.vocabEntry.vocabKey);
        return r;
    };

    const sortedList: AggregateItem[] = vocabList
        .map(v => ({
            vocabEntry: v.vocabEntry,
            vocabRow: v.vocabRow,
            isSelected: selectedKeys.has(v.vocabEntry.vocabKey),
            flexMatches: !flexMatchedKeys || flexMatchedKeys.has(v.vocabEntry.vocabKey || ""),
        }))
        .sort(cmp);

    return (
        <table id={"MyVocab"}>
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
                    <Row
                        key={row.vocabEntry.vocabKey}
                        vocabEntry={row.vocabEntry}
                        vocabRow={row.vocabRow}
                        isDeleting={isDeleting}
                        isSelected={row.isSelected}
                        onToggleSelected={onToggleSelected}
                        isVisible={row.flexMatches}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default withTranslation()(ShowList);
