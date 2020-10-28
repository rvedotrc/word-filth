import * as React from "react";

import GivenDanishQuestionForm from '../shared/given_danish_question_form';
import * as stdq from "../shared/standard_form_question";
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question,
    QuestionFormProps,
    QuestionHeaderProps
} from "../CustomVocab/types";
import {encode} from "lib/results_key";
import BabbelVocabEntry from "./babbel_vocab_entry";

type T = {
    f: boolean;
}

type C = {
    engelsk: string;
}

export default class GivenDanishQuestion implements Question<T, C> {

    public readonly danishQuestion: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;
    public readonly vocabSources: BabbelVocabEntry[];

    constructor(danishQuestion: string, englishAnswers: string[], vocabSources: BabbelVocabEntry[]) {
        this.danishQuestion = danishQuestion;
        this.englishAnswers = englishAnswers;

        this.resultsKey = `babbel-${encode(danishQuestion)}-GivenDanish`;
        this.sortKey = danishQuestion
            .replace(/^(at|en|et) /, '')
        this.resultsLabel = danishQuestion;
        this.answersLabel = englishAnswers.join("; ");
        this.vocabSources = vocabSources;
    }

    get lang() {
        return 'da';
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(GivenDanishQuestionForm, {
            ...props,
            lang: this.lang,
            question: "[Babbel] " + this.danishQuestion,
            allowableAnswers: this.englishAnswers,
            vocabSources: null,
        }, null);
    }

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        throw 'x';
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        throw 'x';
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        throw 'x';
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenDanishQuestion>> {
        throw 'x';
    }

    get correct(): C[] {
        return this.englishAnswers.map(e => ({ engelsk: e }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        throw 'x';
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof GivenDanishQuestion)) return;

        return new GivenDanishQuestion(
            this.danishQuestion,
            [...this.englishAnswers, ...other.englishAnswers],
            [...this.vocabSources, ...other.vocabSources],
        );
    }

}
