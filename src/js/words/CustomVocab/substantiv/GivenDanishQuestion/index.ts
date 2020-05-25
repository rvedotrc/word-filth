import * as React from 'react';

import QuestionForm from './question_form';
import { encode } from "../../../../shared/results_key";
import * as stdq from "../../../shared/standard_form_question";
import {Question} from "../../types";

interface Args {
    lang: string;
    køn: string;
    ubestemtEntalEllerFlertal: string;
    answers: Answer[];
}

interface Answer {
    engelsk: string;
}

class GivenDanishQuestion implements Question {

    public readonly lang: string;
    private readonly køn: string;
    private readonly ubestemtEntalEllerFlertal: string;
    private readonly answers: Answer[];
    public readonly resultsKey: string;

    constructor(args: Args) {
        this.lang = args.lang;
        this.køn = args.køn;
        this.ubestemtEntalEllerFlertal = args.ubestemtEntalEllerFlertal;
        this.answers = args.answers;

        this.resultsKey = `lang=${encode(this.lang || 'da')}`
            + `:type=SubstantivD2E`
            + `:køn=${encode(this.køn)}`
            + `:dansk=${encode(this.ubestemtEntalEllerFlertal)}`;
    }

    get resultsLabel() {
        return `${this.køn} ${this.ubestemtEntalEllerFlertal}`;
    }

    get sortKey() {
        return this.ubestemtEntalEllerFlertal;
    }

    get answersLabel() {
        // TODO i18n
        return this.answers.map(answer => answer.engelsk).sort().join(" / ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            question: this,
        }, null);
    }

    merge(other: GivenDanishQuestion) {
        return new GivenDanishQuestion({
            lang: this.lang,
            køn: this.køn,
            ubestemtEntalEllerFlertal: this.ubestemtEntalEllerFlertal,
            answers: [].concat(this.answers, other.answers), // FIXME dedup? sort?
        });
    }

}

export default GivenDanishQuestion;
