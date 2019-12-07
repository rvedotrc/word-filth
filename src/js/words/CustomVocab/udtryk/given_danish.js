import React from 'react';

import QuestionForm from '../../shared/given_danish';

class GivenDanish {

    constructor(udtryk) {
        this.udtryk = udtryk;

        this.resultsKey = "vocab-" + udtryk.vocabKey + "-GivenDanish";
        this.resultsLabel = udtryk.dansk;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.danishQuestion = this.udtryk.dansk;
        props.englishAnswers = [this.udtryk.engelsk];
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenDanish;
