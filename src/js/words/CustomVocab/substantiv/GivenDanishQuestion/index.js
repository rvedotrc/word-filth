import React from 'react';

import QuestionForm from './question_form';

class GivenDanishQuestion {

    constructor(substantiv) {
        this.substantiv = substantiv;
        this.resultsKey = "vocab-" + substantiv.vocabKey + "-GivenDansk";
        this.resultsLabel = substantiv.ubestemtEntal || substantiv.ubestemtFlertal;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.substantiv = this.substantiv;
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenDanishQuestion;
