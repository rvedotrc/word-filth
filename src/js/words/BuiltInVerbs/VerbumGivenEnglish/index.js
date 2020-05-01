import React from 'react';

import QuestionForm from './question_form';
import { encode } from "../../../shared/results_key";

const uniqueText = list => {
    const keys = {};
    return list.filter(t => {
        return (typeof(t) !== 'string' || keys[t]) ? false : (keys[t] = true)
    });
};

class VerbumGivenEnglish {

    constructor({ lang, english, danishAnswers }) {
        this.lang = lang;
        this.english = english;
        this.danishAnswers = danishAnswers;

        this.resultsKey = `lang=${encode(lang || 'da')}`
            + `:type=VerbumGivenEnglish`
            + `:engelsk=${encode(english)}`;
    }

    get resultsLabel() {
        return this.english;
    }

    get answersLabel() {
        return uniqueText(this.danishAnswers).sort().join(" / ");
    }

    createQuestionForm(props) {
        return React.createElement(QuestionForm, {
            ...props,
            question: this.english,
            allowableAnswers: this.danishAnswers,
        }, null);
    }

    merge(other) {
        return new VerbumGivenEnglish({
            lang: this.lang,
            english: this.english,
            danishAnswers: [...this.danishAnswers, ...other.danishAnswers],
        });
    }

}

export default VerbumGivenEnglish;
