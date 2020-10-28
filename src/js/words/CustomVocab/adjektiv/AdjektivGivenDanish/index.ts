import * as React from 'react';

import QuestionForm from './question_form';
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from '../../types';
import * as stdq from '../../../shared/standard_form_question';
import { encode } from "lib/results_key";
import {unique} from "lib/unique-by";
import TextTidier from "lib/text_tidier";
import Attempt from "./attempt";
import CorrectResponse from "./correct_response";
import Header from "./header";
import Form from "../../udtryk/given_danish_question/form";

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

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            lang: this.lang,
            question: this.grundForm,
            allowableAnswers: this.englishAnswers,
            vocabSources: this.vocabSources,
        }, null);
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

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, AdjektivGivenDanish>> {
        return Header;
    }

    get correct(): C[] {
        return this.englishAnswers.map(engelsk => ({ engelsk }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return TextTidier.normaliseWhitespace(attempt.engelsk).toLowerCase()
            === TextTidier.normaliseWhitespace(correctAnswer.engelsk).toLowerCase();
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
