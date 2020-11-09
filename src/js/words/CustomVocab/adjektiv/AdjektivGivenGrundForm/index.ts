import * as React from 'react';

import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps
} from 'lib/types/question';
import { encode } from "lib/results_key";
import {unique} from "lib/unique-by";
import Attempt from "./attempt";
import Header from "./header";
import Form from "./form";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import AdjektivVocabEntry from "../adjektiv_vocab_entry";

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
    vocabSources: AdjektivVocabEntry[];
}

export type T = Answer

export type C = Answer

class AdjektivGivenGrundForm implements Question<T, C> {

    public readonly lang: string;
    public readonly grundForm: string;
    public readonly engelsk: string | null;
    public readonly answers: Answer[];
    public readonly resultsKey: string;
    public readonly vocabSources: AdjektivVocabEntry[];

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

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        return props => SimpleCorrectResponse({
            correct: props.correct.map(c =>
                [
                    c.tForm,
                    c.langForm,
                    c.komparativ,
                    c.superlativ,
                ].filter(s => s).join(', ')
            ),
        });
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return Form(this.grundForm, this.lang);
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, AdjektivGivenGrundForm>> {
        return Header;
    }

    get correct(): C[] {
        return this.answers;
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        const norm = (v: string | null) => (
            v === null
            ? ""
            : v.trim().toLowerCase()
        );
        const same = (k: keyof T & keyof C) => (
            norm(attempt[k]) === norm(correctAnswer[k])
        );
        return same('tForm') && same('langForm') && same('komparativ') && same('superlativ');
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
