import * as React from "react";

import GivenEnglishQuestionForm from '../shared/given_english_question_form';
import * as stdq from "../shared/standard_form_question";
import {Question} from "../CustomVocab/types";

export default class GivenEnglishQuestion implements Question {

    public readonly englishQuestion: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;

    constructor(englishQuestion: string, danishAnswers: string[]) {
        this.englishQuestion = englishQuestion;
        this.danishAnswers = danishAnswers;

        // FIXME: Paths can't contain ".", "#", "$", "[", or "]"
        this.resultsKey = "babbel-" + englishQuestion.replace(/\./g, '%') + "-GivenEnglish";
        this.sortKey = englishQuestion.replace(/^(to|a|an) /, '');
        this.resultsLabel = englishQuestion;
        this.answersLabel = danishAnswers.join("; ");
    }

    get lang() {
        return 'da';
    }

    createQuestionForm(props: stdq.Props) {
        let q = this.englishQuestion;

        if (!this.englishQuestion.match(/^(a|an) /) && this.danishAnswers.some(t => t.match(/^(en|et) /))) {
            q = q + " [en/et ...]";
        }

        return React.createElement(GivenEnglishQuestionForm, {
            ...props,
            lang: this.lang,
            question: q,
            allowableAnswers: this.danishAnswers,
        }, null);
    }

    merge(): Question | undefined {
        return;
    }

}
