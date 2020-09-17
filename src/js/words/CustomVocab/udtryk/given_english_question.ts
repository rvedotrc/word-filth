import * as React from 'react';

import GivenEnglishQuestionForm from '../../shared/given_english_question_form';
import {Question, VocabEntry} from "../types";
import * as stdq from '../../shared/standard_form_question';
import {encode} from "lib/results_key";

class GivenEnglishQuestion implements Question {

    public readonly lang: string;
    private readonly englishQuestion: string;
    private readonly danishAnswers: string[];
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

    merge(other: Question): Question | undefined {
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
