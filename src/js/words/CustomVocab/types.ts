import * as React from 'react';
import * as stdq from "../shared/standard_form_question";
import {Omit, WithTranslation, WithTranslationProps} from "react-i18next";

export type QuestionFormProps<AT, Q extends Question<AT>> = {
    question: Q;
    onAttempt: (attempt: AT | undefined) => void;
    onShowMessage: (msg: string) => void;
} & WithTranslation

export type AttemptRendererProps<AT> = {
    attempt: AT;
} & WithTranslation

export type CorrectResponseRendererProps<AT, Q extends Question<AT>> = {
    question: Q;
} & WithTranslation;

export type QuestionHeaderProps<AT, Q extends Question<AT>> = {
    question: Q;
} & WithTranslation

export type Question<AT> = {
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

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<AT, Question<AT>>>;
    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<AT, Question<AT>>>;
    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<AT>>;
    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<AT, Question<AT>>>;
    isAttemptCorrect(attempt: AT): boolean;

    // undefined if merging is not possible, e.g. Babbel
    merge(other: Question<any>): Question<AT> | undefined;
}

export type VocabEntryType = "substantiv" | "verbum" | "adjektiv" | "udtryk" | "babbel";

export type VocabEntry = {
    vocabKey: string;
    hidesVocabKey: string | null;
    readOnly: boolean;
    type: VocabEntryType;
    encode(): any; // FIXME-any
    getVocabRow(): VocabRow;
    getQuestions(): Question<any>[];
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
