import React from 'react';

import QuestionForm from './question_form';

import { encode } from '../../../../shared/results_key';

class GivenEnglishUbestemtEntalQuestion {

    constructor({ lang, engelsk, answers }) {
        this.lang = lang;
        this.engelsk = engelsk;
        this.answers = answers;

        this.resultsKey = `lang=${encode(lang || 'da')}`
            + `:type=SubstantivE2DUE`
            + `:engelsk=${encode(engelsk)}`;

        this.resultsLabel = engelsk;

        // TODO i18n
        this.answersLabel = answers.map(answer => `${answer.køn} ${answer.ubestemtEntal}`).sort().join(" / ");
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this;
        return React.createElement(QuestionForm, props, null);
    }

    merge(other) {
        return new GivenEnglishUbestemtEntalQuestion({
            lang: this.lang,
            engelsk: this.engelsk,
            answers: [].concat(this.answers, other.answers), // FIXME dedup? sort?
        });
    }

}

export default GivenEnglishUbestemtEntalQuestion;
