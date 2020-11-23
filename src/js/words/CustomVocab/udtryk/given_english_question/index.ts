import * as React from 'react';

import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question,
    QuestionFormProps,
    QuestionHeaderProps
} from "lib/types/question";
import {encode} from "lib/results_key";

import Attempt from "./attempt";
import FormEnterDanish from "@components/shared/form_enter_danish";
import Header from "./header";

import TextTidier from "lib/text_tidier";
import * as VocabLanguage from "lib/vocab_language";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import UdtrykVocabEntry from "../udtryk_vocab_entry";

export type T = {
    dansk: string;
}

export type C = T

class GivenEnglishQuestion implements Question<T, C> {

    public readonly lang: VocabLanguage.Type;
    public readonly englishQuestion: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;
    public readonly vocabSources: UdtrykVocabEntry[];

    constructor(lang: VocabLanguage.Type, englishQuestion: string, danishAnswers: string[], vocabSources: UdtrykVocabEntry[]) {
        this.lang = lang;
        this.englishQuestion = englishQuestion;
        this.danishAnswers = danishAnswers;

        console.assert(englishQuestion !== '');
        console.assert(danishAnswers.length > 0);
        console.assert(danishAnswers.every(t => t !== ''));

        this.resultsKey = `vocab-udtryk-${encode(englishQuestion)}-GivenEnglish`;
        this.sortKey = englishQuestion.replace(/^(to|a|an) /, '');
        this.resultsLabel = englishQuestion;
        this.answersLabel = danishAnswers.join("; ");
        this.vocabSources = vocabSources;
    }

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        return props => SimpleCorrectResponse({
            correct: props.correct.map(c => c.dansk),
        });
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return FormEnterDanish;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenEnglishQuestion>> {
        return Header;
    }

    get correct(): C[] {
        return this.danishAnswers.map(d => ({ dansk: d }));
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return TextTidier.normaliseWhitespace(attempt.dansk).toLowerCase()
            === TextTidier.normaliseWhitespace(correctAnswer.dansk).toLowerCase();
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
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
