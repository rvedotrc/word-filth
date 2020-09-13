import * as React from 'react';
import {withTranslation, WithTranslation} from "react-i18next";
import {VocabEntry} from "../CustomVocab/types";
import {uniqueBy} from "lib/unique-by";
import * as AppContext from "lib/app_context";

export type Props = {
    vocabSources: VocabEntry[] | null;
} & WithTranslation;

class ShowVocabSources extends React.Component<Props, never> {

    render() {
        // FIXME: no sources for babbel
        if (!this.props.vocabSources) return null;

        const vocabSources: VocabEntry[] = uniqueBy(
            this.props.vocabSources,
            vocabEntry => vocabEntry.vocabKey
        ).sort(
            (a, b) => {
                let r = a.getVocabRow().danskText.localeCompare(b.getVocabRow().danskText);
                if (r === 0) r = a.getVocabRow().engelskText.localeCompare(b.getVocabRow().engelskText);
                if (r === 0 && a.vocabKey && b.vocabKey) r = a.vocabKey?.localeCompare(b.vocabKey);
                return r;
            }
        );

        const { t } = this.props;

        return (
            <p>
                {vocabSources.length === 1
                    ? t('question.shared.source.label')
                    : t('question.shared.sources.label')
                }
                {' '}
                {vocabSources.map((vocabEntry, index) => (
                    <span key={index}>
                        {(index > 0) && ", "}
                        <span
                            className="editVocabPopup"
                            onClick={() => AppContext.startEditVocab(vocabEntry)}
                        >
                            {vocabEntry.getVocabRow().danskText}
                        </span>
                    </span>
                ))}
            </p>
        )

    }

}

export default withTranslation()(ShowVocabSources);
