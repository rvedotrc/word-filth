import * as React from 'react';

import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps
} from 'lib/types/question';
import { encode } from "lib/results_key";
import {unique} from "lib/unique-by";
import TextTidier from "lib/text_tidier";
import Attempt from "./attempt";
import Header from "./header";
import FormEnterDanish from "@components/shared/form_enter_danish";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import AdjektivVocabEntry from "../adjektiv_vocab_entry";

export type Args = {
    lang: string;
    english: string;
    danishAnswers: string[];
    vocabSources: AdjektivVocabEntry[];
}

export type T = {
    dansk: string;
}

export type C = T

class AdjektivGivenEnglish implements Question<T, C> {

    public readonly lang: string;
    public readonly english: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;
    public readonly vocabSources: AdjektivVocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.english = args.english;
        this.danishAnswers = args.danishAnswers;
        this.vocabSources = args.vocabSources;

        this.resultsKey = `lang=${encode(args.lang || 'da')}`
            + `:type=AdjektivGivenEnglish`
            + `:engelsk=${encode(args.english)}`;
    }

    get resultsLabel() {
        return this.english;
    }

    get sortKey() {
        return this.english;
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
        return FormEnterDanish;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, AdjektivGivenEnglish>> {
        return Header;
    }

    get correct(): C[] {
        return this.danishAnswers.map(dansk => ({ dansk }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return TextTidier.normaliseWhitespace(attempt.dansk).toLowerCase()
            === TextTidier.normaliseWhitespace(correctAnswer.dansk).toLowerCase();
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof AdjektivGivenEnglish)) return;

        return new AdjektivGivenEnglish({
            lang: this.lang,
            english: this.english,
            danishAnswers: [...this.danishAnswers, ...other.danishAnswers],
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default AdjektivGivenEnglish;
