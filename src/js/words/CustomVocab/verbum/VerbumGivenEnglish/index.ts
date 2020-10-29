import * as React from 'react';

import { encode } from "lib/results_key";
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from "../../types";
import {unique} from "lib/unique-by";
import TextTidier from "lib/text_tidier";
import Attempt from "./attempt";
import CorrectResponse from "./correct_response";
import Header from "./header";
import Form from "../../udtryk/given_english_question/form";

type Args = {
    lang: string;
    english: string;
    danishAnswers: string[];
    vocabSources: VocabEntry[];
}

export type T = {
    dansk: string;
}

export type C = T

export default class VerbumGivenEnglish implements Question<T, C> {

    public readonly lang: string;
    public readonly english: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor({ lang, english, danishAnswers, vocabSources }: Args) {
        this.lang = lang;
        this.english = english;
        this.danishAnswers = danishAnswers;
        this.vocabSources = vocabSources;

        this.resultsKey = `lang=${encode(lang || 'da')}`
            + `:type=VerbumGivenEnglish`
            + `:engelsk=${encode(english)}`;
    }

    get resultsLabel() {
        return this.english;
    }

    get sortKey() {
        return this.english.replace(/^to /, '');
    }

    get answersLabel() {
        return unique(this.danishAnswers).sort().join(" / ");
    }

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        return CorrectResponse;
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return Form;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, VerbumGivenEnglish>> {
        return Header;
    }

    get correct(): C[] {
        return this.danishAnswers.map(dansk => ({ dansk }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        const particleRE = ({
            'da': /^at\s+/,
            'no': /^å\s+/,
        } as any)[this.lang]; // FIXME-any

        const tidy = (s: string) =>
            TextTidier.normaliseWhitespace(s)
                .toLowerCase()
                .replace(particleRE, '');

        return tidy(attempt.dansk) === tidy(correctAnswer.dansk);
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof VerbumGivenEnglish)) return;

        return new VerbumGivenEnglish({
            lang: this.lang,
            english: this.english,
            danishAnswers: [...this.danishAnswers, ...other.danishAnswers],
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}
