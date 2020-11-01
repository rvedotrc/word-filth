import * as React from 'react';

import { encode } from 'lib/results_key';
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from "../../types";
import SubstantivVocabEntry from "../substantiv_vocab_entry";
import {unique} from "lib/unique-by";
import TextTidier from "lib/text_tidier";
import Attempt from "./attempt";
import Header from "./header";
import Form from "./form";
import SimpleCorrectResponse from "../../../shared/standard_form_question2/simple_correct_response";

type Args = {
    lang: string;
    ubestemtEntal: string;
    answers: SubstantivVocabEntry[];
    vocabSources: VocabEntry[];
}

export type T = {
    køn: string;
    bestemtEntal: string | null;
    ubestemtFlertal: string | null;
    bestemtFlertal: string | null;
}

export type C = T

export default class GivenUbestemtEntalQuestion implements Question<T, C> {

    public readonly lang: string;
    public readonly ubestemtEntal: string;
    public readonly answers: SubstantivVocabEntry[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.ubestemtEntal = args.ubestemtEntal;
        this.answers = args.answers;
        this.vocabSources = args.vocabSources;

        this.resultsKey = `lang=${encode(this.lang)}`
            + `:type=SubstantivDUE2All`
            + `:q=${encode(this.ubestemtEntal)}`;
    }

    get resultsLabel() {
        return this.ubestemtEntal;
    }

    get sortKey() {
        return this.ubestemtEntal;
    }

    get answersLabel() {
        // TODO i18n
        return unique(
            this.answers
                .map(answer => [
                    answer.køn,
                    answer.bestemtEntal,
                    answer.ubestemtFlertal,
                    answer.bestemtFlertal,
                ].filter(s => s).join(", "))
            )
            .sort()
            .join(" / ");
    }

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        return props => SimpleCorrectResponse({
            correct: props.correct.map(c =>
                [
                    c.køn,
                    c.bestemtEntal,
                    c.ubestemtFlertal,
                    c.bestemtFlertal,
                ].filter(s => s).join(', ')
            ),
        });
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return Form(this.ubestemtEntal, this.lang);
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenUbestemtEntalQuestion>> {
        return Header;
    }

    get correct(): C[] {
        return this.answers;
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        const tidy = (s: string | null) => TextTidier.normaliseWhitespace(s || '').toLowerCase();

        return attempt.køn === correctAnswer.køn
            && tidy(attempt.bestemtEntal) === tidy(correctAnswer.bestemtEntal)
            && tidy(attempt.ubestemtFlertal) === tidy(correctAnswer.ubestemtFlertal)
            && tidy(attempt.bestemtFlertal) === tidy(correctAnswer.bestemtFlertal);
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof GivenUbestemtEntalQuestion)) return;

        return new GivenUbestemtEntalQuestion({
            lang: this.lang,
            ubestemtEntal: this.ubestemtEntal,
            answers: [...this.answers, ...other.answers], // FIXME dedup? sort?
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

