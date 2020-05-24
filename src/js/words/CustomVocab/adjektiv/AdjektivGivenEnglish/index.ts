import * as React from 'react';

import QuestionForm from './question_form';
import { Question } from '../adjektiv_question_generator';
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
    english: string;
    danishAnswers: string[];
}

class AdjektivGivenEnglish implements Question {

    public readonly lang: string;
    public readonly english: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;

    constructor(args: Args) {
        this.lang = args.lang;
        this.english = args.english;
        this.danishAnswers = args.danishAnswers;

        this.resultsKey = `lang=${encode(args.lang || 'da')}`
            + `:type=AdjektivGivenEnglish`
            + `:engelsk=${encode(args.english)}`;
    }

    get resultsLabel() {
        return this.english;
    }

    get answersLabel() {
        return uniqueText(this.danishAnswers).sort().join(" / ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            lang: this.lang,
            question: this.english,
            allowableAnswers: this.danishAnswers,
        }, null);
    }

    merge(other: AdjektivGivenEnglish) {
        return new AdjektivGivenEnglish({
            lang: this.lang,
            english: this.english,
            danishAnswers: [...this.danishAnswers, ...other.danishAnswers],
        });
    }

}

export default AdjektivGivenEnglish;
