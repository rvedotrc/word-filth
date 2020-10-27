import * as React from 'react';

import QuestionForm from './question_form';
import { encode } from "lib/results_key";
import * as stdq from "../../../shared/standard_form_question";
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from "../../types";

type Args = {
    lang: string;
    køn: string;
    ubestemtEntalEllerFlertal: string;
    answers: Answer[];
    vocabSources: VocabEntry[];
}

type Answer = {
    engelsk: string;
}

type AT = {
    engelsk: string;
}

class GivenDanishQuestion implements Question<AT> {

    public readonly lang: string;
    public readonly køn: string;
    public readonly ubestemtEntalEllerFlertal: string;
    public readonly answers: Answer[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.køn = args.køn;
        this.ubestemtEntalEllerFlertal = args.ubestemtEntalEllerFlertal;
        this.answers = args.answers;
        this.vocabSources = args.vocabSources;

        this.resultsKey = `lang=${encode(this.lang || 'da')}`
            + `:type=SubstantivD2E`
            + `:køn=${encode(this.køn)}`
            + `:dansk=${encode(this.ubestemtEntalEllerFlertal)}`;
    }

    get resultsLabel() {
        return `${this.køn} ${this.ubestemtEntalEllerFlertal}`;
    }

    get sortKey() {
        return this.ubestemtEntalEllerFlertal;
    }

    get answersLabel() {
        // TODO i18n
        return this.answers.map(answer => answer.engelsk).sort().join(" / ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            question: this,
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

        return new GivenDanishQuestion({
            lang: this.lang,
            køn: this.køn,
            ubestemtEntalEllerFlertal: this.ubestemtEntalEllerFlertal,
            answers: [...this.answers, ...other.answers], // FIXME dedup? sort?
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default GivenDanishQuestion;
