import React from 'react';

import QuestionForm from './question_form';

class GivenEnglish {

    constructor(udtryk) {
        this.udtryk = udtryk;

        this.resultsKey = "vocab-" + udtryk.vocabKey + "-GivenEnglish";
        this.resultsLabel = udtryk.engelsk;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this;
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenEnglish;
