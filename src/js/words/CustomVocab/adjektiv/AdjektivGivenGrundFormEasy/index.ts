import * as React from 'react';

import {
    AttemptRendererProps,
    CorrectResponseRendererProps, multipleAnswersLabel,
    Question, QuestionFormProps,
    QuestionHeaderProps
} from 'lib/types/question';
import { encode } from "lib/results_key";
import * as VocabLanguage from "lib/vocab_language";
import Attempt from "./attempt";
import Header from "./header";
import Form from "./form";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import AdjektivVocabEntry from "../adjektiv_vocab_entry";

export type Answer = {
    tForm: string;
    langForm: string;
};

export type Args = {
    lang: VocabLanguage.Type;
    grundForm: string;
    engelsk: string | null;
    answers: Answer[];
    vocabSources: AdjektivVocabEntry[];
}

export type T = Answer

export type C = Answer

class AdjektivGivenGrundFormEasy implements Question<T, C> {

    public readonly lang: VocabLanguage.Type;
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

        console.assert(args.grundForm !== '');
        // engelsk is optional
        console.assert(args.answers.length > 0);

        this.resultsKey = `lang=${encode(this.lang)}`
            + `:type=AdjektivGivenGrundFormEasy`
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
        return multipleAnswersLabel(
            this.answers.map(answer => {
                return [
                    answer.tForm,
                    answer.langForm,
                ].filter(v => v).join(", ")
            })
        );
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
                ].filter(s => s).join(', ')
            ),
        });
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return Form(this.grundForm, this.lang);
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, AdjektivGivenGrundFormEasy>> {
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
        return same('tForm') && same('langForm');
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof AdjektivGivenGrundFormEasy)) return;

        return new AdjektivGivenGrundFormEasy({
            lang: this.lang,
            grundForm: this.grundForm,
            engelsk: this.engelsk,
            answers: [...this.answers, ...other.answers],
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default AdjektivGivenGrundFormEasy;
