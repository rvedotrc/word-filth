import React from 'react';

import QuestionForm from './question_form';
import { encode } from "../../../shared/results_key";

const uniqueText = list => {
    const keys = {};
    return list.filter(t => {
        return (typeof(t) !== 'string' || keys[t]) ? false : (keys[t] = true)
    });
};

class VerbumGivenDanish {

    constructor({ lang, infinitiv, englishAnswers }) {
        this.lang = lang;
        this.infinitiv = infinitiv;
        this.englishAnswers = englishAnswers;

        // If we didn't store the infinitive with the particle too,
        // this wouldn't be necessary!
        const bareInfinitive = infinitiv.replace(/^(at|å) /, '');

        this.resultsKey = `lang=${encode(lang || 'da')}`
            + `:type=VerbumGivenDanish`
            + `:infinitiv=${encode(bareInfinitive)}`;
    }

    get resultsLabel() {
        return this.infinitiv;
    }

    get answersLabel() {
        return uniqueText(this.englishAnswers).sort().join(" / ");
    }

    createQuestionForm(props) {
        return React.createElement(QuestionForm, {
            ...props,
            question: this.infinitiv,
            allowableAnswers: this.englishAnswers,
        }, null);
    }

    merge(other) {
        return new VerbumGivenDanish({
            lang: this.lang,
            infinitiv: this.infinitiv,
            englishAnswers: [...this.englishAnswers, ...other.englishAnswers],
        });
    }

}

export default VerbumGivenDanish;
