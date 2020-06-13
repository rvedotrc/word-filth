import * as React from 'react';

import QuestionForm from './question_form';
import { Question } from '../../types';
import * as stdq from '../../../shared/standard_form_question';
import { encode } from "lib/results_key";
import {unique} from "lib/unique-by";

export type Answer = {
    tForm: string;
    langForm: string;
    komparativ: string;
    superlativ: string;
} | {
    tForm: string;
    langForm: string;
    komparativ: null;
    superlativ: null;
};

export type Args = {
    lang: string;
    grundForm: string;
    engelsk?: string;
    answers: Answer[];
}

class AdjektivGivenGrundForm implements Question {

    public readonly lang: string;
    public readonly grundForm: string;
    public readonly engelsk?: string;
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

    get sortKey() {
        return this.grundForm;
    }

    get answersLabel() {
        return unique(
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

    merge(other: Question): Question | undefined {
        if (!(other instanceof AdjektivGivenGrundForm)) return;

        return new AdjektivGivenGrundForm({
            lang: this.lang,
            grundForm: this.grundForm,
            engelsk: this.engelsk,
            answers: [...this.answers, ...other.answers],
        });
    }

}

export default AdjektivGivenGrundForm;
