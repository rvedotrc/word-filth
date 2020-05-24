import * as stdq from "../shared/standard_form_question";

export interface Question {
    lang: string;
    resultsKey: string;
    resultsLabel: string;
    answersLabel: string;
    createQuestionForm(props: stdq.Props): any;
}

export type VocabEntryType = 'udtryk' | 'substantiv' | 'adjektiv' | 'verbum';

export interface VocabEntry {
    vocabKey: string;
    getVocabRow(): VocabRow;
}

export interface VocabRow {
    type: VocabEntryType;
    danskText: string
    engelskText: string;
    detaljer: string;
    sortKey: string;
}
