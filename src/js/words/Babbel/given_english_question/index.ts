import * as React from "react";

import GivenEnglishQuestionForm from '../../shared/given_english_question_form';
import * as stdq from "../../shared/standard_form_question";
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question,
    QuestionFormProps,
    QuestionHeaderProps
} from "../../CustomVocab/types";
import {encode} from "lib/results_key";
import BabbelVocabEntry from "../babbel_vocab_entry";
import TextTidier from "lib/text_tidier";
import Attempt from "./attempt";
import CorrectResponse from "./correct_response";
import Header from "./header";
import Form from "../../../words/CustomVocab/udtryk/given_english_question/form";

export type T = {
    dansk: string;
}

export type C = {
    dansk: string;
}

export default class GivenEnglishQuestion implements Question<T, C> {

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

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        return CorrectResponse;
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return Form;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenEnglishQuestion>> {
        return Header;
    }

    get correct(): C[] {
        return this.danishAnswers.map(dansk => ({ dansk }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return TextTidier.normaliseWhitespace(attempt.dansk).toLowerCase()
            === TextTidier.normaliseWhitespace(correctAnswer.dansk).toLowerCase();
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof GivenEnglishQuestion)) return;

        return new GivenEnglishQuestion(
            this.englishQuestion,
            [...this.danishAnswers, ...other.danishAnswers],
            [...this.vocabSources, ...other.vocabSources],
        );
    }

}
