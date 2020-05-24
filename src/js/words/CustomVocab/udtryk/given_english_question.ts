import * as React from 'react';

import GivenEnglishQuestionForm from '../../shared/given_english_question_form';
import {Question} from "../types";
import * as stdq from '../../shared/standard_form_question';

class GivenEnglishQuestion implements Question {

    public readonly lang: string;
    private readonly englishQuestion: string;
    private readonly danishAnswers: string[];
    public readonly resultsKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;

    constructor(lang: string, englishQuestion: string, danishAnswers: string[]) {
        this.englishQuestion = englishQuestion;
        this.danishAnswers = danishAnswers;

        // FIXME: Paths can't contain ".", "#", "$", "[", or "]"
        this.resultsKey = `vocab-udtryk-${englishQuestion.replace(/\./g, '%')}-GivenEnglish`;
        this.resultsLabel = englishQuestion;
        this.answersLabel = danishAnswers.join("; ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(GivenEnglishQuestionForm, {
            ...props,
            lang: this.lang,
            question: this.englishQuestion,
            allowableAnswers: this.danishAnswers,
        }, null);
    }

    merge(other: GivenEnglishQuestion) {
        return new GivenEnglishQuestion(
            this.lang,
            this.englishQuestion,
            [...this.danishAnswers, ...other.danishAnswers],
        );
    }

}

export default GivenEnglishQuestion;