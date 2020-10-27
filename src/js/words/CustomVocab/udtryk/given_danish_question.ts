import * as React from 'react';

import GivenDanishQuestionForm from '../../shared/given_danish_question_form';
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question,
    QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from "../types";
import * as stdq from '../../shared/standard_form_question';
import {encode} from "lib/results_key";

import Attempt from './given_danish_question/attempt';
import CorrectResponse from "./given_danish_question/correct_response";
import Form from "./given_danish_question/form";

import TextTidier from "lib/text_tidier";
import Header from "./given_danish_question/header";

export type AT = {
    engelsk: string;
}

class GivenDanishQuestion implements Question<AT> {

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

    createQuestionForm(props: stdq.Props) {
        return React.createElement(GivenDanishQuestionForm, {
            ...props,
            lang: this.lang,
            question: this.danishQuestion,
            allowableAnswers: this.englishAnswers,
            vocabSources: this.vocabSources,
        }, null);
    }

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<AT>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<AT, GivenDanishQuestion>> {
        return CorrectResponse;
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<AT, GivenDanishQuestion>> {
        return Form;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<AT, GivenDanishQuestion>> {
        return Header;
    }

    isAttemptCorrect(attempt: AT): boolean {
        return this.englishAnswers.some(answer =>
            TextTidier.discardComments(attempt.engelsk).toLowerCase()
            === TextTidier.discardComments(answer).toLowerCase()
        );
    }

    merge(other: Question<any>): Question<AT> | undefined {
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
