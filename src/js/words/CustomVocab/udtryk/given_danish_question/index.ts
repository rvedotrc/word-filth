import * as React from 'react';

import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question,
    QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from "../../types";
import {encode} from "lib/results_key";

import Attempt from './attempt';
import CorrectResponse from "./correct_response";
import Form from "./form";
import Header from "./header";

import TextTidier from "lib/text_tidier";

export type T = {
    engelsk: string;
}

export type C = T

class GivenDanishQuestion implements Question<T, C> {

    public readonly lang: string;
    public readonly danishQuestion: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;
    public readonly vocabSources: VocabEntry[];

    constructor(lang: string, danishQuestion: string, englishAnswers: string[], vocabSources: VocabEntry[]) {
        this.lang = lang;
        this.danishQuestion = danishQuestion;
        this.englishAnswers = englishAnswers;

        this.resultsKey = `vocab-udtryk-${encode(danishQuestion)}-GivenDanish`;
        this.sortKey = danishQuestion.replace(/^(at|en|et) /, '');
        this.resultsLabel = danishQuestion;
        this.answersLabel = englishAnswers.join("; ");
        this.vocabSources = vocabSources;
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
        return this.englishAnswers.map(e => ({ engelsk: e }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return TextTidier.discardComments(attempt.engelsk).toLowerCase()
            === TextTidier.discardComments(correctAnswer.engelsk).toLowerCase();
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof GivenDanishQuestion)) return;

        return new GivenDanishQuestion(
            this.lang,
            this.danishQuestion,
            [...this.englishAnswers, ...other.englishAnswers],
            [...this.vocabSources, ...other.vocabSources],
        );
    }

}

export default GivenDanishQuestion;
