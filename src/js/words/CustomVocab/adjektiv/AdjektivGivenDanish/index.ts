import * as React from 'react';

import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from '../../types';
import { encode } from "lib/results_key";
import {unique} from "lib/unique-by";
import TextTidier from "lib/text_tidier";
import Attempt from "./attempt";
import Header from "./header";
import FormEnterEnglish from "@components/shared/form_enter_english";
import SimpleCorrectResponse from "../../../shared/standard_form_question2/simple_correct_response";

export type Args = {
    lang: string;
    grundForm: string;
    englishAnswers: string[];
    vocabSources: VocabEntry[];
}

export type T = {
    engelsk: string;
}

export type C = T

class AdjektivGivenDanish implements Question<T, C> {

    public readonly lang: string;
    public readonly grundForm: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.grundForm = args.grundForm;
        this.englishAnswers = args.englishAnswers;
        this.vocabSources = args.vocabSources;

        this.resultsKey = `lang=${encode(args.lang || 'da')}`
            + `:type=AdjektivGivenDanish`
            + `:grundForm=${encode(args.grundForm)}`;
    }

    get resultsLabel() {
        return this.grundForm;
    }

    get sortKey() {
        return this.grundForm;
    }

    get answersLabel() {
        return unique(this.englishAnswers).sort().join(" / ");
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
        return FormEnterEnglish;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, AdjektivGivenDanish>> {
        return Header;
    }

    get correct(): C[] {
        return this.englishAnswers.map(engelsk => ({ engelsk }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return TextTidier.discardComments(attempt.engelsk).toLowerCase()
            === TextTidier.discardComments(correctAnswer.engelsk).toLowerCase();
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof AdjektivGivenDanish)) return;

        return new AdjektivGivenDanish({
            lang: this.lang,
            grundForm: this.grundForm,
            englishAnswers: [...this.englishAnswers, ...other.englishAnswers],
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default AdjektivGivenDanish;
