import * as React from 'react';

import { encode } from 'lib/results_key';
import {
    AttemptRendererProps,
    CorrectResponseRendererProps, multipleAnswersLabel,
    Question, QuestionFormProps,
    QuestionHeaderProps
} from "lib/types/question";
import SubstantivVocabEntry from "../substantiv_vocab_entry";
import TextTidier from "lib/text_tidier";
import * as VocabLanguage from "lib/vocab_language";
import Attempt from "./attempt";
import Header from "./header";
import Form from "./form";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import * as Gender from "lib/gender";

type Args = {
    lang: VocabLanguage.Type;
    ubestemt: string;
    answers: SubstantivVocabEntry[];
    vocabSources: SubstantivVocabEntry[];
}

export type T = {
    køn: Gender.Type;
    bestemtEntal: string | null;
    ubestemtFlertal: string | null;
    bestemtFlertal: string | null;
}

export type C = T

export default class GivenUbestemtQuestion implements Question<T, C> {

    public readonly lang: VocabLanguage.Type;
    public readonly ubestemt: string;
    public readonly answers: SubstantivVocabEntry[];
    public readonly resultsKey: string;
    public readonly vocabSources: SubstantivVocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.ubestemt = args.ubestemt;
        this.answers = args.answers;
        this.vocabSources = args.vocabSources;

        console.assert(args.ubestemt !== '');
        console.assert(args.answers.length > 0);

        this.resultsKey = `lang=${encode(this.lang)}`
            + `:type=SubstantivDUE2All`
            + `:q=${encode(this.ubestemt)}`;
    }

    get resultsLabel() {
        return this.ubestemt;
    }

    get sortKey() {
        return this.ubestemt;
    }

    get answersLabel() {
        return multipleAnswersLabel(
            this.answers
                .map(answer => [
                    answer.køn,
                    answer.bestemtEntal,
                    answer.ubestemtFlertal,
                    answer.bestemtFlertal,
                ].filter(s => s).join(", "))
        );
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
        return Form(this.ubestemt, this.lang);
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenUbestemtQuestion>> {
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
        if (!(other instanceof GivenUbestemtQuestion)) return;

        return new GivenUbestemtQuestion({
            lang: this.lang,
            ubestemt: this.ubestemt,
            answers: [...this.answers, ...other.answers], // FIXME dedup? sort?
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

