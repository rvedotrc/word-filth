import * as React from "react";

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
import Header from "./header";
import FormEnterEnglish from "@components/shared/form_enter_english";
import SimpleCorrectResponse from "../../shared/standard_form_question2/simple_correct_response";

export type T = {
    engelsk: string;
}

export type C = {
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

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        return props => SimpleCorrectResponse({
            correct: props.correct.map(c => c.engelsk),
        });
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return FormEnterEnglish;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenDanishQuestion>> {
        return Header;
    }

    get correct(): C[] {
        return this.englishAnswers.map(engelsk => ({ engelsk }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return TextTidier.discardComments(attempt.engelsk).toLowerCase()
            === TextTidier.discardComments(correctAnswer.engelsk).toLowerCase();
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
