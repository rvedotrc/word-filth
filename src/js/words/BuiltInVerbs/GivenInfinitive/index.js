import React from 'react';

import QuestionForm from './question_form';

class GivenInfinitive {

    constructor(infinitive, verbs) {
        this.infinitive = infinitive;
        this.verbs = verbs;

        const uniq = {};
        verbs.map(v => v.engelsk).filter(v => v).map(e => uniq[e] = true);
        const text = Object.keys(uniq).sort().join('; ');
        if (text !== '') this.engelsk = text;

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
