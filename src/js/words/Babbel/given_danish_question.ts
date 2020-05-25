import * as React from "react";

import GivenDanishQuestionForm from '../shared/given_danish_question_form';
import * as stdq from "../shared/standard_form_question";
import {Question} from "../CustomVocab/types";

export default class GivenDanishQuestion implements Question {

    public readonly danishQuestion: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;

    constructor(danishQuestion: string, englishAnswers: string[]) {
        this.danishQuestion = danishQuestion;
        this.englishAnswers = englishAnswers;

        // FIXME: Paths can't contain ".", "#", "$", "[", or "]"
        this.resultsKey = "babbel-" + danishQuestion.replace(/\./g, '%') + "-GivenDanish";
        this.resultsLabel = danishQuestion;
        this.answersLabel = englishAnswers.join("; ");
    }

    get lang() {
        return 'da';
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(GivenDanishQuestionForm, {
            ...props,
            lang: this.lang,
            question: this.danishQuestion,
            allowableAnswers: this.englishAnswers,
        }, null);
    }

}
