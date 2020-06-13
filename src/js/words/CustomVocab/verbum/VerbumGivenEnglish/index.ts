import * as React from 'react';

import QuestionForm from './question_form';
import { encode } from "lib/results_key";
import * as stdq from "../../../shared/standard_form_question";
import {Question} from "../../types";
import {unique} from "lib/unique-by";

type Args = {
    lang: string;
    english: string;
    danishAnswers: string[];
}

export default class VerbumGivenEnglish implements Question {

    public readonly lang: string;
    public readonly english: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;

    constructor({ lang, english, danishAnswers }: Args) {
        this.lang = lang;
        this.english = english;
        this.danishAnswers = danishAnswers;

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

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            lang: this.lang,
            question: this.english,
            allowableAnswers: this.danishAnswers,
        }, null);
    }

    merge(other: Question): Question | undefined {
        if (!(other instanceof VerbumGivenEnglish)) return;

        return new VerbumGivenEnglish({
            lang: this.lang,
            english: this.english,
            danishAnswers: [...this.danishAnswers, ...other.danishAnswers],
        });
    }

}
