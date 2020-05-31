import * as React from 'react';

import QuestionForm from './question_form';
import { Question } from '../../types';
import * as stdq from '../../../shared/standard_form_question';
import { encode } from "../../../../shared/results_key";

const uniqueText = (list: string[]) => {
    const keys: any = {};
    return list.filter(t => {
        return (typeof(t) !== 'string' || keys[t]) ? false : (keys[t] = true)
    });
};

export interface Args {
    lang: string;
    grundForm: string;
    englishAnswers: string[];
}

class AdjektivGivenDanish implements Question {

    public readonly lang: string;
    public readonly grundForm: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;

    constructor(args: Args) {
        this.lang = args.lang;
        this.grundForm = args.grundForm;
        this.englishAnswers = args.englishAnswers;

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
        return uniqueText(this.englishAnswers).sort().join(" / ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            lang: this.lang,
            question: this.grundForm,
            allowableAnswers: this.englishAnswers,
        }, null);
    }

    merge(other: Question): Question {
        if (!(other instanceof AdjektivGivenDanish)) return;

        return new AdjektivGivenDanish({
            lang: this.lang,
            grundForm: this.grundForm,
            englishAnswers: [...this.englishAnswers, ...other.englishAnswers],
        });
    }

}

export default AdjektivGivenDanish;
