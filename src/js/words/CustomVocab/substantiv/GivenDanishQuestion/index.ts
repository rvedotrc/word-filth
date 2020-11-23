import * as React from 'react';

import { encode } from "lib/results_key";
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps
} from "lib/types/question";
import TextTidier from "lib/text_tidier";
import * as VocabLanguage from "lib/vocab_language";
import Attempt from "./attempt";
import Header from "./header";
import FormEnterEnglish from "@components/shared/form_enter_english";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import SubstantivVocabEntry from "../substantiv_vocab_entry";
import * as Gender from "lib/gender";

type Args = {
    lang: VocabLanguage.Type;
    køn: Gender.Type;
    ubestemtEntalEllerFlertal: string;
    answers: Answer[];
    vocabSources: SubstantivVocabEntry[];
}

type Answer = {
    engelsk: string;
}

export type T = {
    engelsk: string;
}

export type C = T

class GivenDanishQuestion implements Question<T, C> {

    public readonly lang: VocabLanguage.Type;
    public readonly køn: Gender.Type;
    public readonly ubestemtEntalEllerFlertal: string;
    public readonly answers: Answer[];
    public readonly resultsKey: string;
    public readonly vocabSources: SubstantivVocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.køn = args.køn;
        this.ubestemtEntalEllerFlertal = args.ubestemtEntalEllerFlertal;
        this.answers = args.answers;
        this.vocabSources = args.vocabSources;

        console.assert(args.ubestemtEntalEllerFlertal !== '');
        console.assert(args.answers.length > 0);
        console.assert(args.answers.every(t => t.engelsk !== ''));

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
        return props => SimpleCorrectResponse({
            correct: props.correct.map(c => c.engelsk),
        });
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return FormEnterEnglish;
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
