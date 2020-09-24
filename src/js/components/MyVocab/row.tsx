import * as AppContext from "lib/app_context";
import * as React from "react";
import {VocabEntry, VocabRow} from "../../words/CustomVocab/types";
import {WithTranslation, withTranslation} from "react-i18next";

type Props = {
    vocabRow: VocabRow;
    vocabEntry: VocabEntry;
    isVisible: boolean;
    isDeleting: boolean;
    isSelected: boolean;
    onToggleSelected: (vocabEntry: VocabEntry) => void;
} & WithTranslation

const Row = (props: Props) => {
    const { t, vocabEntry, vocabRow, isVisible, isDeleting, isSelected } = props;

    return (
        <tr
            key={vocabEntry.vocabKey}
            onDoubleClick={() => AppContext.startEditVocab(vocabEntry)}
            className={vocabEntry.readOnly ? "readonly" : undefined}
            style={{display: isVisible ? "table-row" : "none"}}
        >
            {/* my_vocab.table.type.adjektiv */}
            {/* my_vocab.table.type.substantiv */}
            {/* my_vocab.table.type.udtryk */}
            {/* my_vocab.table.type.verbum */}
            <td>{t(`my_vocab.table.type.${vocabRow.type}`)}</td>
            {isDeleting && (
                <td>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => props.onToggleSelected(vocabEntry)}
                    />
                </td>
            )}
            <td>{vocabRow.danskText}</td>
            <td>{vocabRow.engelskText}</td>
            <td>{vocabRow.detaljer}</td>
            <td>{(vocabRow.tags || []).join(" ")}</td>
        </tr>

    );

}

export default withTranslation()(Row);
