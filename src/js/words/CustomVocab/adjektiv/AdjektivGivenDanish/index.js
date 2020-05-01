import React from 'react';

import QuestionForm from './question_form';
import { encode } from "../../../../shared/results_key";

const uniqueText = list => {
    const keys = {};
    return list.filter(t => {
        return (typeof(t) !== 'string' || keys[t]) ? false : (keys[t] = true)
    });
};

class AdjektivGivenDanish {

    constructor({ lang, grundForm, englishAnswers }) {
        this.lang = lang;
        this.grundForm = grundForm;
        this.englishAnswers = englishAnswers;

        this.resultsKey = `lang=${encode(lang || 'da')}`
            + `:type=AdjektivGivenDanish`
            + `:grundForm=${encode(grundForm)}`;
    }

    get resultsLabel() {
        return this.grundForm;
    }

    get answersLabel() {
        return uniqueText(this.englishAnswers).sort().join(" / ");
    }

    createQuestionForm(props) {
        return React.createElement(QuestionForm, {
            ...props,
            question: this.grundForm,
            allowableAnswers: this.englishAnswers,
        }, null);
    }

    merge(other) {
        return new AdjektivGivenDanish({
            lang: this.lang,
            grundForm: this.grundForm,
            englishAnswers: [...this.englishAnswers, ...other.englishAnswers],
        });
    }

}

export default AdjektivGivenDanish;
