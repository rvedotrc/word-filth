import React from 'react';

import QuestionForm from './question_form';
import { encode } from "../../../../shared/results_key";

class GivenDanishQuestion {

    constructor({ lang, køn, ubestemtEntalEllerFlertal, answers }) {
        this.lang = lang;
        this.køn = køn;
        this.ubestemtEntalEllerFlertal = ubestemtEntalEllerFlertal;
        this.answers = answers;

        this.resultsKey = `lang=${encode(lang || 'da')}`
            + `:type=SubstantivD2E`
            + `:køn=${encode(køn)}`
            + `:dansk=${encode(ubestemtEntalEllerFlertal)}`;

        this.resultsLabel = `${køn} ${ubestemtEntalEllerFlertal}`;

        // TODO i18n
        this.answersLabel = answers.map(a => a.engelsk).sort().join(" / ");
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this;
        // props.allowableAnswers = TextTidier.toMultiValue(this.substantiv.engelsk);
        return React.createElement(QuestionForm, props, null);
    }

    merge(other) {
        return new GivenDanishQuestion({
            lang: this.lang,
            køn: this.køn,
            ubestemtEntalEllerFlertal: this.ubestemtEntalEllerFlertal,
            answers: [].concat(this.answers, other.answers), // FIXME dedup? sort?
        });
    }

}

export default GivenDanishQuestion;
