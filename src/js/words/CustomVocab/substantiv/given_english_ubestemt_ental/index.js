import React from 'react';

import QuestionForm from './question_form';

class GivenEnglishUbestemtEntal {

    constructor(substantiv) {
        this.substantiv = substantiv;
        if (!substantiv.ubestemtEntal) throw 'Noun has no ubestemtEntal';

        this.resultsKey = "vocab-" + substantiv.vocabKey + "-GivenEnglishUbestemtEntal";
        this.resultsLabel = substantiv.engelsk;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.substantiv = this.substantiv;
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenEnglishUbestemtEntal;
