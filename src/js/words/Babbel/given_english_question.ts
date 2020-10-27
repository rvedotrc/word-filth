import * as React from "react";

import GivenEnglishQuestionForm from '../shared/given_english_question_form';
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

type AT = {
    f: boolean;
}

export default class GivenEnglishQuestion implements Question<AT> {

    public readonly englishQuestion: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;
    public readonly vocabSources: BabbelVocabEntry[];

    constructor(englishQuestion: string, danishAnswers: string[], vocabSources: BabbelVocabEntry[]) {
        this.englishQuestion = englishQuestion;
        this.danishAnswers = danishAnswers;

        this.resultsKey = `babbel-${encode(englishQuestion)}-GivenEnglish`;
        this.sortKey = englishQuestion.replace(/^(to|a|an) /, '');
        this.resultsLabel = englishQuestion;
        this.answersLabel = danishAnswers.join("; ");
        this.vocabSources = vocabSources;
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
            question: "[Babbel] " + q,
            allowableAnswers: this.danishAnswers,
            vocabSources: null,
        }, null);
    }

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<AT>> {
        return () => null;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<AT, GivenEnglishQuestion>> {
        return () => null;
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<AT, GivenEnglishQuestion>> {
        return () => null;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<AT, GivenEnglishQuestion>> {
        return () => null;
    }

    isAttemptCorrect(attempt: AT): boolean {
        return false;
    }

    merge(other: Question<any>): Question<AT> | undefined {
        if (!(other instanceof GivenEnglishQuestion)) return;

        return new GivenEnglishQuestion(
            this.englishQuestion,
            [...this.danishAnswers, ...other.danishAnswers],
            [...this.vocabSources, ...other.vocabSources],
        );
    }

}
