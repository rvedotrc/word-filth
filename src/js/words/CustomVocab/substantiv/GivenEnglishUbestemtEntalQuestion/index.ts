import * as React from 'react';

import QuestionForm from './question_form';

import { encode } from '../../../../shared/results_key';
import * as stdq from '../../../shared/standard_form_question';

interface Args {
    lang: string;
    engelsk: string;
    answers: Answer[];
}

interface Answer {
    køn: string;
    ubestemtEntal: string;
}

class GivenEnglishUbestemtEntalQuestion {

    public readonly lang: string;
    private readonly engelsk: string;
    private readonly answers: Answer[];
    public readonly resultsKey: string;

    constructor(args: Args) {
        this.lang = args.lang;
        this.engelsk = args.engelsk;
        this.answers = args.answers;

        this.resultsKey = `lang=${encode(this.lang || 'da')}`
            + `:type=SubstantivE2DUE`
            + `:engelsk=${encode(this.engelsk)}`;
    }

    get resultsLabel() {
        return this.engelsk;
    }

    get answersLabel() {
        // TODO i18n
        return this.answers
            .map(answer => `${answer.køn} ${answer.ubestemtEntal}`)
            .sort()
            .join(" / ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            question: this,
        }, null);
    }

    merge(other: GivenEnglishUbestemtEntalQuestion) {
        return new GivenEnglishUbestemtEntalQuestion({
            lang: this.lang,
            engelsk: this.engelsk,
            answers: [].concat(this.answers, other.answers), // FIXME dedup? sort?
        });
    }

}

export default GivenEnglishUbestemtEntalQuestion;
