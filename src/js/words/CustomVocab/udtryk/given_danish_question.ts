import * as React from 'react';

import GivenDanishQuestionForm from '../../shared/given_danish_question_form';
import {Question, VocabEntry} from "../types";
import * as stdq from '../../shared/standard_form_question';

class GivenDanishQuestion implements Question {

    public readonly lang: string;
    private readonly danishQuestion: string;
    private readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;
    public readonly vocabSources: VocabEntry[];

    constructor(lang: string, danishQuestion: string, englishAnswers: string[], vocabSources: VocabEntry[]) {
        this.lang = lang;
        this.danishQuestion = danishQuestion;
        this.englishAnswers = englishAnswers;

        // FIXME: Paths can't contain ".", "#", "$", "[", or "]"
        this.resultsKey = `vocab-udtryk-${danishQuestion.replace(/\./g, '%')}-GivenDanish`;
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

    merge(other: Question): Question | undefined {
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
