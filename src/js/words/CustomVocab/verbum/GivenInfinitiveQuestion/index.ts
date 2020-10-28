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
import {unique} from "lib/unique-by";
import Attempt from "./attempt";
import CorrectResponse from "./correct_response";
import Header from "./header";
import Form from "./form";

export type VerbData = {
    lang: string;
    nutid: string[];
    datid: string[];
    førnutid: string[];
    engelsk: string | null;
}

export type T = {
    nutid: string;
    datid: string;
    førnutid: string;
}

export type C = {
    nutid: string[];
    datid: string[];
    førnutid: string[];
}

export default class GivenInfinitiveQuestion implements Question<T, C> {

    public readonly lang: string;
    public readonly infinitive: string;
    public readonly verbs: VerbData[];
    public readonly engelsk: string | null;
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;
    public readonly vocabSources: VocabEntry[];

    constructor(infinitive: string, verbs: VerbData[], vocabSources: VocabEntry[]) {
        this.lang = verbs[0].lang;
        this.infinitive = infinitive;
        this.verbs = verbs;
        this.vocabSources = vocabSources;

        // If we didn't store the infinitive with the particle too,
        // this wouldn't be necessary!
        const bareInfinitive = infinitive.replace(/^(at|å) /, '');

        const text = unique(verbs.map(v => v.engelsk).filter(e => e)).sort().join('; ');
        if (text !== '') this.engelsk = text;

        // Bit hacky; could fix with a migration.
        const lang = verbs[0].lang || 'da';
        if (lang === 'da') {
            this.resultsKey = `verb-infinitiv-${bareInfinitive}`;
        } else {
            // If we didn't store the infinitive with the particle too,
            // this wouldn't be necessary!
            this.resultsKey = `lang=${encode(lang)}`
                + `:type=VerbumGivenInfinitive`
                + `:infinitiv=${encode(bareInfinitive)}`;
        }

        this.resultsLabel = infinitive;

        this.sortKey = infinitive.replace(/^(at|å) /, '');

        this.answersLabel = unique(
            verbs.map(verb => {
                return [
                    verb.nutid.join('/'),
                    verb.datid.join('/'),
                    verb.førnutid.join('/'),
                ].join(', ');
            })
        ).sort().join('; ');
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            question: this,
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

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenInfinitiveQuestion>> {
        return Header;
    }

    get correct(): C[] {
        return this.verbs;
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return correctAnswer.nutid.indexOf(attempt.nutid.toLowerCase()) >= 0
            && correctAnswer.datid.indexOf(attempt.datid.toLowerCase()) >= 0
            && correctAnswer.førnutid.indexOf(attempt.førnutid.toLowerCase()) >= 0;
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof GivenInfinitiveQuestion)) return;

        return new GivenInfinitiveQuestion(
            this.infinitive,
            [...this.verbs, ...other.verbs],
            [...this.vocabSources, ...other.vocabSources],
        )
    }

}
