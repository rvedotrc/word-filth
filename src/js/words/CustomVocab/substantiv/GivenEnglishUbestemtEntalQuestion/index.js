import React from 'react';

import QuestionForm from './question_form';

class GivenEnglishUbestemtEntalQuestion {

    constructor(substantiv) {
        this.substantiv = substantiv;
        if (!substantiv.ubestemtEntal) throw 'Noun has no ubestemtEntal';

        this.resultsKey = "vocab-" + substantiv.vocabKey + "-GivenEnglishUbestemtEntal";
        this.resultsLabel = substantiv.engelsk;
        this.answersLabel = `${substantiv.køn} ${substantiv.ubestemtEntal}`;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.substantiv = this.substantiv;
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenEnglishUbestemtEntalQuestion;
