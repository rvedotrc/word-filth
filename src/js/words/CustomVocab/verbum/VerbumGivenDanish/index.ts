import * as React from 'react';

import QuestionForm from './question_form';
import { encode } from "lib/results_key";
import * as stdq from "../../../shared/standard_form_question";
import {Question} from "../../types";
import {unique} from "lib/unique-by";

interface Args {
    lang: string;
    infinitiv: string;
    englishAnswers: string[];
}

export default class VerbumGivenDanish implements Question {

    public readonly lang: string;
    public readonly infinitiv: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;

    constructor({ lang, infinitiv, englishAnswers }: Args) {
        this.lang = lang;
        this.infinitiv = infinitiv;
        this.englishAnswers = englishAnswers;

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

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            lang: this.lang,
            question: this.infinitiv,
            allowableAnswers: this.englishAnswers,
        }, null);
    }

    merge(other: Question): Question {
        if (!(other instanceof VerbumGivenDanish)) return;

        return new VerbumGivenDanish({
            lang: this.lang,
            infinitiv: this.infinitiv,
            englishAnswers: [...this.englishAnswers, ...other.englishAnswers],
        });
    }

}

