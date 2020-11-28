import * as React from 'react';

import {
    AttemptRendererProps,
    CorrectResponseRendererProps, multipleAnswersLabel,
    Question, QuestionFormProps,
    QuestionHeaderProps
} from 'lib/types/question';
import { encode } from "lib/results_key";
import TextTidier from "lib/text_tidier";
import * as VocabLanguage from "lib/vocab_language";
import Attempt from "./attempt";
import Header from "./header";
import FormEnterDanish from "@components/shared/form_enter_danish";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import AdjektivVocabEntry from "../adjektiv_vocab_entry";

export type Args = {
    lang: VocabLanguage.Type;
    english: string;
    danishAnswers: string[];
    vocabSources: AdjektivVocabEntry[];
}

export type T = {
    dansk: string;
}

export type C = T

class AdjektivGivenEnglish implements Question<T, C> {

    public readonly lang: VocabLanguage.Type;
    public readonly english: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;
    public readonly vocabSources: AdjektivVocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.english = args.english;
        this.danishAnswers = args.danishAnswers;
        this.vocabSources = args.vocabSources;

        console.assert(args.english !== '');
        console.assert(args.danishAnswers.length > 0);
        console.assert(args.danishAnswers.every(t => t.length > 0));

        this.resultsKey = `lang=${encode(args.lang)}`
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
        // TODO: use danish_grund_form_label
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
