import * as React from 'react';

import QuestionForm from './question_form';
import { encode } from "../../../../shared/results_key";
import * as stdq from "../../../shared/standard_form_question";
import {Question} from "../../types";

const uniqueText = (list: string[]) => {
    const keys: any = {};
    return list.filter(t => {
        return (typeof(t) !== 'string' || keys[t]) ? false : (keys[t] = true)
    });
};

export interface VerbData {
    lang: string;
    nutid: string[];
    datid: string[];
    førnutid: string[];
    engelsk: string;
}

export default class GivenInfinitiveQuestion implements Question {

    public readonly lang: string;
    public readonly infinitive: string;
    public readonly verbs: VerbData[];
    public readonly engelsk: string;
    public readonly resultsKey: string;
    public readonly sortKey: string;
    public readonly resultsLabel: string;
    public readonly answersLabel: string;

    constructor(infinitive: string, verbs: VerbData[]) {
        this.lang = verbs[0].lang;
        this.infinitive = infinitive;
        this.verbs = verbs;

        // If we didn't store the infinitive with the particle too,
        // this wouldn't be necessary!
        const bareInfinitive = infinitive.replace(/^(at|å) /, '');

        const text = uniqueText(verbs.map(v => v.engelsk)).sort().join('; ');
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

        this.answersLabel = uniqueText(
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

    merge(other: Question): Question {
        if (!(other instanceof GivenInfinitiveQuestion)) return;

        return new GivenInfinitiveQuestion(
            this.infinitive,
            [...this.verbs, ...other.verbs],
        )
    }

}
