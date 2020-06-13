import * as React from 'react';
import * as stdq from "../shared/standard_form_question";
import {Omit, WithTranslation, WithTranslationProps} from "react-i18next";

export interface Question {
    lang: string;

    // Results storage and question merging
    resultsKey: string;

    sortKey: string;

    // First column of table
    resultsLabel: string;

    // Second column of table
    answersLabel: string;

    createQuestionForm(props: stdq.Props): any; // FIXME-any

    merge(other: Question): Question | undefined;
}

export type VocabEntryType = string;

export type CheckedVocabType = "substantiv" | "verbum" | "adjektiv" | "udtryk";

export interface VocabEntry {
    vocabKey: string | null;
    type: string;
    encode(): any; // FIXME-any
    getVocabRow(): VocabRow;
    getQuestions(): Question[];
}

export interface VocabRow {
    type: VocabEntryType;
    danskText: string
    engelskText: string;
    detaljer: string;
    sortKey: string;
}

export interface AdderProps extends WithTranslation {
    dbref: firebase.database.Reference;
    onCancel: () => void;
    onSearch: (text: string) => void;
    vocabLanguage: string;
    editingExistingEntry: VocabEntry;
}

export type AdderComponentClass = React.ComponentType<Omit<AdderProps, keyof WithTranslation> & WithTranslationProps>;
