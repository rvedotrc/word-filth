import * as React from 'react';

import {
    AttemptRendererProps,
    CorrectResponseRendererProps, multipleAnswersLabel,
    Question, QuestionFormProps,
    QuestionHeaderProps
} from 'lib/types/question';
import { encode } from "lib/results_key";
import TextTidier from "lib/text_tidier";
import * as VocabLanguage from "lib/vocab_language";
import Attempt from "./attempt";
import Header from "./header";
import FormEnterEnglish from "@components/shared/form_enter_english";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import AdjektivVocabEntry from "../adjektiv_vocab_entry";

export type Args = {
    lang: VocabLanguage.Type;
    grundForm: string;
    englishAnswers: string[];
    vocabSources: AdjektivVocabEntry[];
}

export type T = {
    engelsk: string;
}

export type C = T

class AdjektivGivenDanish implements Question<T, C> {

    public readonly lang: VocabLanguage.Type;
    public readonly grundForm: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly vocabSources: AdjektivVocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.grundForm = args.grundForm;
        this.englishAnswers = args.englishAnswers;
        this.vocabSources = args.vocabSources;

        console.assert(args.grundForm !== '');
        console.assert(args.englishAnswers.length > 0);
        console.assert(args.englishAnswers.every(t => t.length > 0));

        this.resultsKey = `lang=${encode(args.lang)}`
            + `:type=AdjektivGivenDanish`
            + `:grundForm=${encode(args.grundForm)}`;
    }

    get resultsLabel() {
        return this.grundForm;
    }

    get sortKey() {
        return this.grundForm;
    }

    get answersLabel() {
        return multipleAnswersLabel(this.englishAnswers);
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

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, AdjektivGivenDanish>> {
        return Header;
    }

    get correct(): C[] {
        return this.englishAnswers.map(engelsk => ({ engelsk }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return TextTidier.discardComments(attempt.engelsk).toLowerCase()
            === TextTidier.discardComments(correctAnswer.engelsk).toLowerCase();
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof AdjektivGivenDanish)) return;

        return new AdjektivGivenDanish({
            lang: this.lang,
            grundForm: this.grundForm,
            englishAnswers: [...this.englishAnswers, ...other.englishAnswers],
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default AdjektivGivenDanish;
