import React from 'react';

import QuestionForm from '../../shared/given_english';

class GivenEnglish {

    constructor(udtryk) {
        this.udtryk = udtryk;

        this.resultsKey = "vocab-" + udtryk.vocabKey + "-GivenEnglish";
        this.resultsLabel = udtryk.engelsk;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.englishQuestion = this.udtryk.engelsk;
        props.danishAnswers = [this.udtryk.dansk];
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenEnglish;
