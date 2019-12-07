import React from "react";

import QuestionForm from './question_form';

class GivenDanish {

    constructor(udtryk) {
        this.udtryk = udtryk;

        this.resultsKey = "vocab-" + udtryk.vocabKey + "-GivenDanish";
        this.resultsLabel = udtryk.dansk;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this;
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenDanish;
