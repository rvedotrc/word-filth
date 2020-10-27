import * as React from 'react';

import QuestionForm from './question_form';
import {
    AttemptRendererProps,
    CorrectResponseRendererProps,
    Question, QuestionFormProps,
    QuestionHeaderProps,
    VocabEntry
} from '../../types';
import * as stdq from '../../../shared/standard_form_question';
import { encode } from "lib/results_key";
import {unique} from "lib/unique-by";

export type Args = {
    lang: string;
    grundForm: string;
    englishAnswers: string[];
    vocabSources: VocabEntry[];
}

type AT = {
    f: boolean;
}

class AdjektivGivenDanish implements Question<AT> {

    public readonly lang: string;
    public readonly grundForm: string;
    public readonly englishAnswers: string[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.grundForm = args.grundForm;
        this.englishAnswers = args.englishAnswers;
        this.vocabSources = args.vocabSources;

        this.resultsKey = `lang=${encode(args.lang || 'da')}`
            + `:type=AdjektivGivenDanish`
            + `:grundForm=${encode(args.grundForm)}`;
    }

    get resultsLabel() {
        return this.grundForm;
    }

    get sortKey() {
        return this.grundForm;
    }

    get answersLabel() {
        return unique(this.englishAnswers).sort().join(" / ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            lang: this.lang,
            question: this.grundForm,
            allowableAnswers: this.englishAnswers,
            vocabSources: this.vocabSources,
        }, null);
    }

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<AT>> {
        return () => null;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<AT, AdjektivGivenDanish>> {
        return () => null;
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<AT, AdjektivGivenDanish>> {
        return () => null;
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<AT, AdjektivGivenDanish>> {
        return () => null;
    }

    isAttemptCorrect(attempt: AT): boolean {
        return false;
    }

    merge(other: Question<any>): Question<AT> | undefined {
        if (!(other instanceof AdjektivGivenDanish)) return;

        return new AdjektivGivenDanish({
            lang: this.lang,
            grundForm: this.grundForm,
            englishAnswers: [...this.englishAnswers, ...other.englishAnswers],
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default AdjektivGivenDanish;
