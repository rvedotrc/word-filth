import React from "react";

import QuestionForm from '../shared/given_english';

class GivenEnglish {

    constructor(englishQuestion, danishAnswers) {
        this.englishQuestion = englishQuestion;
        this.danishAnswers = danishAnswers;

        this.resultsKey = "babbel-" + englishQuestion + "-GivenEnglish";
        this.resultsLabel = englishQuestion;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this.englishQuestion;
        props.allowableAnswers = this.danishAnswers;
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenEnglish;
