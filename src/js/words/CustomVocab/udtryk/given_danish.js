import React from 'react';

import QuestionForm from '../../shared/given_danish';

class GivenDanish {

    constructor(danishQuestion, englishAnswers) {
        this.danishQuestion = danishQuestion;
        this.englishAnswers = englishAnswers;

        this.resultsKey = `vocab-udtryk-${danishQuestion}-GivenDanish`;
        this.resultsLabel = danishQuestion;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this.danishQuestion;
        props.allowableAnswers = this.englishAnswers;
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenDanish;
