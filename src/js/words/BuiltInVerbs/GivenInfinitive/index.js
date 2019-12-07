import React from 'react';

import QuestionForm from './question_form';

class GivenInfinitive {

    constructor(infinitive, verbs) {
        this.infinitive = infinitive;
        this.verbs = verbs;

        this.resultsKey = infinitive.replace(/^at /, 'verb-infinitiv-');
        this.resultsLabel = infinitive;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this;
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenInfinitive;
