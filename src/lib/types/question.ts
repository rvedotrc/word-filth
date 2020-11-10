import * as React from 'react';
import {Omit, WithTranslation, WithTranslationProps} from "react-i18next";

import * as VocabLanguage from "lib/vocab_language";

export type QuestionFormProps<AT> = {
    lang: VocabLanguage.Type;
    onAttempt: (attempt: AT | undefined) => void;
    onShowMessage: (msg: string) => void;
} & WithTranslation

export type AttemptRendererProps<T> = {
    attempt: T;
} & WithTranslation

export type CorrectResponseRendererProps<C> = {
    correct: C[];
} & WithTranslation;

export type QuestionHeaderProps<T, C, Q extends Question<T, C>> = {
    question: Q;
} & WithTranslation

export type Question<T, C> = {
    lang: VocabLanguage.Type;

    // Results storage and question merging
    resultsKey: string;

    sortKey: string;

    // First column of table
    resultsLabel: string;

    // Second column of table
    answersLabel: string;

    // null if sources not available, e.g. Babbel
    vocabSources: VocabEntry[] | null;

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, Question<T, C>>>;
    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>>;
    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>>;
    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>>;
    correct: C[];
    doesAttemptMatchCorrectAnswer(attempt: T, correct: C): boolean;

    // undefined if merging is not possible, e.g. Babbel
    merge(other: Question<any, any>): Question<T, C> | undefined;
}

export type VocabEntryType = "substantiv" | "verbum" | "adjektiv" | "udtryk" | "babbel";

export type VocabEntry = {
    vocabKey: string;
    hidesVocabKey: string | null;
    readOnly: boolean;
    lang: VocabLanguage.Type;
    type: VocabEntryType;
    encode(): any; // FIXME-any
    getVocabRow(): VocabRow;
    getQuestions(): Question<any, any>[];
}

export type VocabRow = {
    type: string;
    danskText: string
    engelskText: string;
    detaljer: string;
    sortKey: string;
    tags: string[] | null;
}

export type ResultHistory = {
    timestamp: number;
    isCorrect: boolean;
}

export type Result = {
    level: number;
    history: ResultHistory[];
    nextTimestamp: number | undefined;
}

export type QuestionAndResult = {
    question: Question<any, any>;
    result: Result;
}

export type AdderProps = {
    dbref: firebase.database.Reference;
    onCancel: () => void;
    onSearch: (text: string) => void;
    vocabLanguage: VocabLanguage.Type;
    editingExistingEntry: VocabEntry;
} & WithTranslation

export type AdderComponentClass = React.ComponentType<Omit<AdderProps, keyof WithTranslation> & WithTranslationProps>;
