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

export type Answer = {
    tForm: string;
    langForm: string;
    komparativ: string | null;
    superlativ: string | null;
};

export type Args = {
    lang: string;
    grundForm: string;
    engelsk: string | null;
    answers: Answer[];
    vocabSources: VocabEntry[];
}

type T = {
    d: boolean;
}

type C = {
    sd: boolean;
}

class AdjektivGivenGrundForm implements Question<T, C> {

    public readonly lang: string;
    public readonly grundForm: string;
    public readonly engelsk: string | null;
    public readonly answers: Answer[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.grundForm = args.grundForm;
        this.engelsk = args.engelsk;
        this.answers = args.answers;
        this.vocabSources = args.vocabSources;

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

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        throw 'x';
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        throw 'x';
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        throw 'x';
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, AdjektivGivenGrundForm>> {
        throw 'x';
    }

    get correct(): C[] {
        throw 'x';
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        throw 'x';
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof AdjektivGivenGrundForm)) return;

        return new AdjektivGivenGrundForm({
            lang: this.lang,
            grundForm: this.grundForm,
            engelsk: this.engelsk,
            answers: [...this.answers, ...other.answers],
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default AdjektivGivenGrundForm;
