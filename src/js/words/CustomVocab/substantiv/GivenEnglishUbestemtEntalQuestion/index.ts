import * as React from 'react';

import { encode } from 'lib/results_key';
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from "../../types";
import Attempt from "./attempt";
import CorrectResponse from "./correct_response";
import Header from "./header";
import Form from "./form";

type Args = {
    lang: string;
    engelsk: string;
    answers: Answer[];
    vocabSources: VocabEntry[];
}

type Answer = {
    køn: string;
    ubestemtEntal: string;
}

export type T = Answer

export type C = Answer

class GivenEnglishUbestemtEntalQuestion implements Question<T, C> {

    public readonly lang: string;
    public readonly engelsk: string;
    public readonly answers: Answer[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.engelsk = args.engelsk;
        this.answers = args.answers;
        this.vocabSources = args.vocabSources;

        this.resultsKey = `lang=${encode(this.lang || 'da')}`
            + `:type=SubstantivE2DUE`
            + `:engelsk=${encode(this.engelsk)}`;
    }

    get resultsLabel() {
        return this.engelsk;
    }

    get sortKey() {
        return this.engelsk;
    }

    get answersLabel() {
        // TODO i18n
        return this.answers
            .map(answer => `${answer.køn} ${answer.ubestemtEntal}`)
            .sort()
            .join(" / ");
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

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenEnglishUbestemtEntalQuestion>> {
        return Header;
    }

    get correct(): C[] {
        return this.answers;
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return attempt.køn.trim().toLowerCase() === correctAnswer.køn.trim().toLowerCase()
            && attempt.ubestemtEntal.trim().toLowerCase() === correctAnswer.ubestemtEntal.trim().toLowerCase();
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof GivenEnglishUbestemtEntalQuestion)) return;

        return new GivenEnglishUbestemtEntalQuestion({
            lang: this.lang,
            engelsk: this.engelsk,
            answers: [...this.answers, ...other.answers], // FIXME dedup? sort?
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default GivenEnglishUbestemtEntalQuestion;
