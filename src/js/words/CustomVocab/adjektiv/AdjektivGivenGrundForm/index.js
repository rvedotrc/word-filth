import React from 'react';

import QuestionForm from './question_form';
import { encode } from "../../../../shared/results_key";

const uniqueText = list => {
    const keys = {};
    return list.filter(t => {
        return (typeof(t) !== 'string' || keys[t]) ? false : (keys[t] = true)
    });
};

class AdjektivGivenGrundForm {

    constructor({ lang, grundForm, engelsk, answers }) {
        this.lang = lang;
        this.grundForm = grundForm;
        this.engelsk = engelsk;
        this.answers = answers;

        this.resultsKey = `lang=${encode(lang || 'da')}`
            + `:type=AdjektivGivenGrundForm`
            + `:grundForm=${encode(grundForm)}`;

        if (this.engelsk) this.resultsKey += `:engelsk=${encode(engelsk)}`;
    }

    get resultsLabel() {
        return this.grundForm;
    }

    get answersLabel() {
        return uniqueText(
            this.answers.map(answer => {
                return [
                    answer.tForm,
                    answer.langForm,
                    answer.komparativ,
                    answer.superlativ,
                ].filter(v => v).join(", ")
            })
        ).sort().join(" / ");
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this;
        return React.createElement(QuestionForm, props, null);
    }

    merge(other) {
        return new AdjektivGivenGrundForm({
            lang: this.lang,
            grundForm: this.grundForm,
            engelsk: this.engelsk,
            answers: [...this.answers, ...other.answers],
        });
    }

}

export default AdjektivGivenGrundForm;
