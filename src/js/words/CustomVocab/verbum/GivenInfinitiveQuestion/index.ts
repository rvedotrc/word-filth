import * as React from 'react';

import { encode } from "lib/results_key";
import {
    AttemptRendererProps,
    CorrectResponseRendererProps, multipleAnswersLabel,
    Question, QuestionFormProps,
    QuestionHeaderProps
} from "lib/types/question";
import {unique} from "lib/unique-by";
import Attempt from "./attempt";
import Header from "./header";
import Form from "./form";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import {removeParticle} from "lib/particle";
import * as VocabLanguage from "lib/vocab_language";
import VerbumVocabEntry from "../verbum_vocab_entry";

export type VerbData = {
    lang: VocabLanguage.Type;
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

const formatVerbInflections = (verb: VerbumVocabEntry): string => {
    return [
        verb.nutid.join('/'),
        verb.datid.join('/'),
        verb.førnutid.join('/'),
    ].join(', ');
};

export default class GivenInfinitiveQuestion implements Question<T, C> {

    public readonly lang: VocabLanguage.Type;
    public readonly infinitive: string;
    public readonly verbs: VerbData[];
    public readonly engelsk: string | null;
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;
    public readonly vocabSources: VerbumVocabEntry[];

    constructor(infinitive: string, verbs: VerbData[], vocabSources: VerbumVocabEntry[]) {
        this.lang = verbs[0].lang;
        this.infinitive = infinitive;
        this.verbs = verbs;
        this.vocabSources = vocabSources;

        console.assert(infinitive !== '');
        console.assert(verbs.length > 0);
        console.assert(vocabSources.every(v =>
            v.nutid.every(t => t !== '')
            && v.datid.every(t => t !== '')
            && v.førnutid.every(t => t !== '')
        ));
        // engelsk is optional

        // If we didn't store the infinitive with the particle too,
        // this wouldn't be necessary!
        const bareInfinitive = removeParticle(this.lang, infinitive);

        const text = unique(verbs.map(v => v.engelsk).filter(e => e)).sort().join('; ');
        if (text !== '') this.engelsk = text;

        // Bit hacky; could fix with a migration.
        const lang = verbs[0].lang;
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

        this.sortKey = removeParticle(lang, infinitive);

        this.answersLabel = multipleAnswersLabel(verbs.map(formatVerbInflections));
    }

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        return props => SimpleCorrectResponse({
            correct: props.correct.map(formatVerbInflections)
        });
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        // If we didn't store the infinitive with the particle too,
        // this wouldn't be necessary!
        const bareInfinitive = removeParticle(this.lang, this.infinitive);

        return Form(bareInfinitive, this.lang);
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
