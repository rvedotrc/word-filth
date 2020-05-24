import * as React from 'react';

import GivenDanishQuestionForm from '../../shared/given_danish_question_form';
import {Question} from "../types";
import * as stdq from '../../shared/standard_form_question';

class GivenDanishQuestion implements Question {

    public readonly lang: string;
    private readonly danishQuestion: string;
    private readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;

    constructor(lang: string, danishQuestion: string, englishAnswers: string[]) {
        this.lang = lang;
        this.danishQuestion = danishQuestion;
        this.englishAnswers = englishAnswers;

        // FIXME: Paths can't contain ".", "#", "$", "[", or "]"
        this.resultsKey = `vocab-udtryk-${danishQuestion.replace(/\./g, '%')}-GivenDanish`;
        this.resultsLabel = danishQuestion;
        this.answersLabel = englishAnswers.join("; ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(GivenDanishQuestionForm, {
            ...props,
            lang: this.lang,
            question: this.danishQuestion,
            allowableAnswers: this.englishAnswers,
        }, null);
    }

    merge(other: GivenDanishQuestion) {
        return new GivenDanishQuestion(
            this.lang,
            this.danishQuestion,
            [...this.englishAnswers, ...other.englishAnswers],
        );
    }

}

export default GivenDanishQuestion;
