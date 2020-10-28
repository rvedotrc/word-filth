import * as React from 'react';

import GivenEnglishQuestionForm from '../../../shared/given_english_question_form';
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question,
    QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from "../../types";
import * as stdq from '../../../shared/standard_form_question';
import {encode} from "lib/results_key";

import CorrectResponse from "./correct_response";
import Attempt from "./attempt";
import Form from "./form";
import Header from "./header";

import TextTidier from "lib/text_tidier";

export type T = {
    dansk: string;
}

export type C = T

class GivenEnglishQuestion implements Question<T, C> {

    public readonly lang: string;
    public readonly englishQuestion: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;
    public readonly vocabSources: VocabEntry[];

    constructor(lang: string, englishQuestion: string, danishAnswers: string[], vocabSources: VocabEntry[]) {
        this.englishQuestion = englishQuestion;
        this.danishAnswers = danishAnswers;

        this.resultsKey = `vocab-udtryk-${encode(englishQuestion)}-GivenEnglish`;
        this.sortKey = englishQuestion.replace(/^(to|a|an) /, '');
        this.resultsLabel = englishQuestion;
        this.answersLabel = danishAnswers.join("; ");
        this.vocabSources = vocabSources;
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(GivenEnglishQuestionForm, {
            ...props,
            lang: this.lang,
            question: this.englishQuestion,
            allowableAnswers: this.danishAnswers,
            vocabSources: this.vocabSources,
        }, null);
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

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenEnglishQuestion>> {
        return Header;
    }

    get correct(): C[] {
        return this.danishAnswers.map(d => ({ dansk: d }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return this.danishAnswers.some(answer =>
            TextTidier.discardComments(attempt.dansk).toLowerCase()
            === TextTidier.discardComments(answer).toLowerCase()
        );
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof GivenEnglishQuestion)) return;

        return new GivenEnglishQuestion(
            this.lang,
            this.englishQuestion,
            [...this.danishAnswers, ...other.danishAnswers],
            [...this.vocabSources, ...other.vocabSources],
        );
    }

}

export default GivenEnglishQuestion;
