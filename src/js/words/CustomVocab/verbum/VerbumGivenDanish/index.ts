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
import FormEnterEnglish from "@components/shared/form_enter_english";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import {removeParticle} from "lib/particle";
import VerbumVocabEntry from "../verbum_vocab_entry";

type Args = {
    lang: VocabLanguage.Type;
    infinitiv: string;
    englishAnswers: string[];
    vocabSources: VerbumVocabEntry[];
}

export type T = {
    engelsk: string;
}

export type C = T

export default class VerbumGivenDanish implements Question<T, C> {

    public readonly lang: VocabLanguage.Type;
    public readonly infinitiv: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly vocabSources: VerbumVocabEntry[];

    constructor({ lang, infinitiv, englishAnswers, vocabSources }: Args) {
        this.lang = lang;
        this.infinitiv = infinitiv;
        this.englishAnswers = englishAnswers;
        this.vocabSources = vocabSources;

        console.assert(infinitiv !== '');
        console.assert(englishAnswers.length > 0);
        console.assert(englishAnswers.every(t => t !== ''));

        // If we didn't store the infinitive with the particle too,
        // this wouldn't be necessary!
        const bareInfinitive = removeParticle(lang, infinitiv);

        this.resultsKey = `lang=${encode(lang)}`
            + `:type=VerbumGivenDanish`
            + `:infinitiv=${encode(bareInfinitive)}`;
    }

    get resultsLabel() {
        return this.infinitiv;
    }

    get sortKey() {
        return removeParticle(this.lang, this.infinitiv);
    }

    get answersLabel() {
        return multipleAnswersLabel(this.englishAnswers);
    }

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        return props => SimpleCorrectResponse({
            correct: props.correct.map(c => c.engelsk),
        });
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return (props: QuestionFormProps<T>) =>
            FormEnterEnglish({
                ...props,
                onAttempt: (attempt => {
                    if (attempt && !attempt.engelsk.toLowerCase().startsWith('to ')) {
                        attempt.engelsk = 'to ' + attempt.engelsk;
                    }
                    return props.onAttempt(attempt);
                }),
            });
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

