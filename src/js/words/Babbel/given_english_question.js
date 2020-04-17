import React from "react";

import GivenEnglishQuestionForm from '../shared/given_english_question_form';

class GivenEnglishQuestion {

    constructor(englishQuestion, danishAnswers) {
        this.englishQuestion = englishQuestion;
        this.danishAnswers = danishAnswers;

        // FIXME: Paths can't contain ".", "#", "$", "[", or "]"
        this.resultsKey = "babbel-" + englishQuestion.replace(/\./g, '%') + "-GivenEnglish";
        this.resultsLabel = englishQuestion;
        this.answersLabel = danishAnswers.join("; ");
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this.englishQuestion;

        if (!this.englishQuestion.match(/^(a|an) /) && this.danishAnswers.some(t => t.match(/^(en|et) /))) {
            props.question = props.question + " [en/et ...]";
        }

        props.allowableAnswers = this.danishAnswers;
        return React.createElement(GivenEnglishQuestionForm, props, null);
    }

}

export default GivenEnglishQuestion;
