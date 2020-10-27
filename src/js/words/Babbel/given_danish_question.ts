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

type AT = {
    f: boolean;
}

export default class GivenDanishQuestion implements Question<AT> {

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

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<AT>> {
        return () => null;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<AT, GivenDanishQuestion>> {
        return () => null;
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<AT, GivenDanishQuestion>> {
        return () => null;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<AT, GivenDanishQuestion>> {
        return () => null;
    }

    isAttemptCorrect(attempt: AT): boolean {
        return false;
    }

    merge(other: Question<any>): Question<AT> | undefined {
        if (!(other instanceof GivenDanishQuestion)) return;

        return new GivenDanishQuestion(
            this.danishQuestion,
            [...this.englishAnswers, ...other.englishAnswers],
            [...this.vocabSources, ...other.vocabSources],
        );
    }

}
