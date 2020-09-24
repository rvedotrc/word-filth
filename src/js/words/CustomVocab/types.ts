import * as React from 'react';
import * as stdq from "../shared/standard_form_question";
import {Omit, WithTranslation, WithTranslationProps} from "react-i18next";

export type Question = {
    lang: string;

    // Results storage and question merging
    resultsKey: string;

    sortKey: string;

    // First column of table
    resultsLabel: string;

    // Second column of table
    answersLabel: string;

    // null if sources not available, e.g. Babbel
    vocabSources: VocabEntry[] | null;

    createQuestionForm(props: stdq.Props): any; // FIXME-any

    // undefined if merging is not possible, e.g. Babbel
    merge(other: Question): Question | undefined;
}

export type VocabEntryType = "substantiv" | "verbum" | "adjektiv" | "udtryk" | "babbel";

export type VocabEntry = {
    vocabKey: string;
    hidesVocabKey: string | null;
    readOnly: boolean;
    type: VocabEntryType;
    encode(): any; // FIXME-any
    getVocabRow(): VocabRow;
    getQuestions(): Question[];
}

export type VocabRow = {
    type: string;
    danskText: string
    engelskText: string;
    detaljer: string;
    sortKey: string;
    tags: string[] | null;
}

export type AdderProps = {
    dbref: firebase.database.Reference;
    onCancel: () => void;
    onSearch: (text: string) => void;
    vocabLanguage: string;
    editingExistingEntry: VocabEntry;
} & WithTranslation

export type AdderComponentClass = React.ComponentType<Omit<AdderProps, keyof WithTranslation> & WithTranslationProps>;
