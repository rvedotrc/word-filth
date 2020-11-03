import * as React from 'react';

import { encode } from "lib/results_key";
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from "lib/types/question";
import {unique} from "lib/unique-by";
import TextTidier from "lib/text_tidier";
import Attempt from "./attempt";
import Header from "./header";
import FormEnterDanish from "@components/shared/form_enter_danish";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import {addParticle, removeParticle} from "lib/particle";

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
        return props => SimpleCorrectResponse({
            correct: props.correct.map(c => c.dansk),
        });
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return (props: QuestionFormProps<T>) =>
            FormEnterDanish({
                ...props,
                onAttempt: (attempt => {
                    return props.onAttempt(
                        attempt
                            ? { dansk: addParticle(this.lang, attempt?.dansk) }
                            : undefined
                    );
                }),
            });
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, VerbumGivenEnglish>> {
        return Header;
    }

    get correct(): C[] {
        return this.danishAnswers.map(dansk => ({ dansk }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        const tidy = (s: string) =>
            removeParticle(
                this.lang,
                TextTidier.normaliseWhitespace(s).toLowerCase()
            );

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
