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

export interface Answer {
    tForm: string;
    langForm: string;
    komparativ: string | undefined;
    superlativ: string | undefined;
}

export interface Args {
    lang: string;
    grundForm: string;
    engelsk: string;
    answers: Answer[];
}

class AdjektivGivenGrundForm implements Question {

    public readonly lang: string;
    public readonly grundForm: string;
    public readonly engelsk: string;
    public readonly answers: Answer[];
    public readonly resultsKey: string;

    constructor(args: Args) {
        this.lang = args.lang;
        this.grundForm = args.grundForm;
        this.engelsk = args.engelsk;
        this.answers = args.answers;

        this.resultsKey = `lang=${encode(this.lang || 'da')}`
            + `:type=AdjektivGivenGrundForm`
            + `:grundForm=${encode(this.grundForm)}`;

        if (this.engelsk) this.resultsKey += `:engelsk=${encode(this.engelsk)}`;
    }

    get resultsLabel() {
        return this.grundForm;
    }

    get answersLabel() {
        return uniqueText(
            this.answers.map(answer => {
                return [
                    answer.tForm,
                    answer.langForm,
                    answer.komparativ,
                    answer.superlativ,
                ].filter(v => v).join(", ")
            })
        ).sort().join(" / ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            question: this,
        }, null);
    }

    merge(other: AdjektivGivenGrundForm) {
        return new AdjektivGivenGrundForm({
            lang: this.lang,
            grundForm: this.grundForm,
            engelsk: this.engelsk,
            answers: [...this.answers, ...other.answers],
        });
    }

}

export default AdjektivGivenGrundForm;
