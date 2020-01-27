import React from 'react';

import GivenEnglishQuestionForm from '../../shared/given_english_question_form';

class GivenEnglishQuestion {

    constructor(englishQuestion, danishAnswers) {
        this.englishQuestion = englishQuestion;
        this.danishAnswers = danishAnswers;

        // FIXME: Paths can't contain ".", "#", "$", "[", or "]"
        this.resultsKey = `vocab-udtryk-${englishQuestion.replace(/\./g, '%')}-GivenEnglish`;
        this.resultsLabel = englishQuestion;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this.englishQuestion;
        props.allowableAnswers = this.danishAnswers;
        return React.createElement(GivenEnglishQuestionForm, props, null);
    }

}

export default GivenEnglishQuestion;
