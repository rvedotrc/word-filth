import React from 'react';

import GivenDanishQuestionForm from '../../shared/given_danish_question_form';

class GivenDanishQuestion {

    constructor(danishQuestion, englishAnswers) {
        this.danishQuestion = danishQuestion;
        this.englishAnswers = englishAnswers;

        // FIXME: Paths can't contain ".", "#", "$", "[", or "]"
        this.resultsKey = `vocab-udtryk-${danishQuestion.replace(/\./g, '%')}-GivenDanish`;
        this.resultsLabel = danishQuestion;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this.danishQuestion;
        props.allowableAnswers = this.englishAnswers;
        return React.createElement(GivenDanishQuestionForm, props, null);
    }

}

export default GivenDanishQuestion;
