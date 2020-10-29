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
import Form from "../../udtryk/given_danish_question/form";

type Args = {
    lang: string;
    infinitiv: string;
    englishAnswers: string[];
    vocabSources: VocabEntry[];
}

export type T = {
    engelsk: string;
}

export type C = T

export default class VerbumGivenDanish implements Question<T, C> {

    public readonly lang: string;
    public readonly infinitiv: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor({ lang, infinitiv, englishAnswers, vocabSources }: Args) {
        this.lang = lang;
        this.infinitiv = infinitiv;
        this.englishAnswers = englishAnswers;
        this.vocabSources = vocabSources;

        // If we didn't store the infinitive with the particle too,
        // this wouldn't be necessary!
        const bareInfinitive = infinitiv.replace(/^(at|å) /, '');

        this.resultsKey = `lang=${encode(lang || 'da')}`
            + `:type=VerbumGivenDanish`
            + `:infinitiv=${encode(bareInfinitive)}`;
    }

    get resultsLabel() {
        return this.infinitiv;
    }

    get sortKey() {
        return this.infinitiv.replace(/^(at|å) /, '');
    }

    get answersLabel() {
        return unique(this.englishAnswers).sort().join(" / ");
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

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, VerbumGivenDanish>> {
        return Header;
    }

    get correct(): C[] {
        return this.englishAnswers.map(engelsk => ({ engelsk }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        const tidy = (s: string) =>
            TextTidier.discardComments(s)
                .toLowerCase()
                .replace(/^to /, '');

        return tidy(attempt.engelsk) === tidy(correctAnswer.engelsk);
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof VerbumGivenDanish)) return;

        return new VerbumGivenDanish({
            lang: this.lang,
            infinitiv: this.infinitiv,
            englishAnswers: [...this.englishAnswers, ...other.englishAnswers],
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

