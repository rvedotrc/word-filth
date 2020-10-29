import * as React from 'react';

import { encode } from "lib/results_key";
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from "../../types";
import TextTidier from "lib/text_tidier";
import Attempt from "./attempt";
import CorrectResponse from "./correct_response";
import Header from "./header";
import Form from "../../udtryk/given_danish_question/form";

type Args = {
    lang: string;
    køn: string;
    ubestemtEntalEllerFlertal: string;
    answers: Answer[];
    vocabSources: VocabEntry[];
}

type Answer = {
    engelsk: string;
}

export type T = {
    engelsk: string;
}

export type C = T

class GivenDanishQuestion implements Question<T, C> {

    public readonly lang: string;
    public readonly køn: string;
    public readonly ubestemtEntalEllerFlertal: string;
    public readonly answers: Answer[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.køn = args.køn;
        this.ubestemtEntalEllerFlertal = args.ubestemtEntalEllerFlertal;
        this.answers = args.answers;
        this.vocabSources = args.vocabSources;

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

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        return CorrectResponse;
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return Form;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenDanishQuestion>> {
        return Header;
    }

    get correct(): C[] {
        return this.answers;
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return TextTidier.discardComments(attempt.engelsk).toLowerCase()
            === TextTidier.discardComments(correctAnswer.engelsk).toLowerCase();
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof GivenDanishQuestion)) return;

        return new GivenDanishQuestion({
            lang: this.lang,
            køn: this.køn,
            ubestemtEntalEllerFlertal: this.ubestemtEntalEllerFlertal,
            answers: [...this.answers, ...other.answers], // FIXME dedup? sort?
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default GivenDanishQuestion;
