import * as stdq from "../shared/standard_form_question";

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

    merge(other: Question): Question;
}

export type VocabEntryType = string;

export interface VocabEntry {
    vocabKey: string;
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
