import * as React from 'react';

import { encode } from "lib/results_key";
import {
    AttemptRendererProps,
    CorrectResponseRendererProps, multipleAnswersLabel,
    Question, QuestionFormProps,
    QuestionHeaderProps
} from "lib/types/question";
import TextTidier from "lib/text_tidier";
import * as VocabLanguage from "lib/vocab_language";
import Attempt from "./attempt";
import Header from "./header";
import FormEnterDanish from "@components/shared/form_enter_danish";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import {addParticle, removeParticle} from "lib/particle";
import VerbumVocabEntry from "../verbum_vocab_entry";

type Args = {
    lang: VocabLanguage.Type;
    english: string;
    danishAnswers: string[];
    vocabSources: VerbumVocabEntry[];
}

export type T = {
    dansk: string;
}

export type C = T

export default class VerbumGivenEnglish implements Question<T, C> {

    public readonly lang: VocabLanguage.Type;
    public readonly english: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;
    public readonly vocabSources: VerbumVocabEntry[];

    constructor({ lang, english, danishAnswers, vocabSources }: Args) {
        this.lang = lang;
        this.english = english;
        this.danishAnswers = danishAnswers;
        this.vocabSources = vocabSources;

        console.assert(english !== '');
        console.assert(danishAnswers.length > 0);
        console.assert(danishAnswers.every(t => t !== ''));

        this.resultsKey = `lang=${encode(lang)}`
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
        return multipleAnswersLabel(this.danishAnswers);
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
