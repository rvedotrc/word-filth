import * as React from "react";

import GivenDanishQuestionForm from '../shared/given_danish_question_form';
import * as stdq from "../shared/standard_form_question";
import {Question} from "../CustomVocab/types";
import {encode} from "lib/results_key";

export default class GivenDanishQuestion implements Question {

    public readonly danishQuestion: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;

    constructor(danishQuestion: string, englishAnswers: string[]) {
        this.danishQuestion = danishQuestion;
        this.englishAnswers = englishAnswers;

        this.resultsKey = `babbel-${encode(danishQuestion)}-GivenDanish`;
        this.sortKey = danishQuestion
            .replace(/^(at|en|et) /, '')
        this.resultsLabel = danishQuestion;
        this.answersLabel = englishAnswers.join("; ");
    }

    get lang() {
        return 'da';
    }

    get vocabSources() {
        return null;
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(GivenDanishQuestionForm, {
            ...props,
            lang: this.lang,
            question: this.danishQuestion,
            allowableAnswers: this.englishAnswers,
            vocabSources: null,
        }, null);
    }

    merge(other: Question): Question | undefined {
        if (!(other instanceof GivenDanishQuestion)) return;

        return new GivenDanishQuestion(this.danishQuestion, [
            ...this.englishAnswers,
            ...other.englishAnswers,
        ]);
    }

}
