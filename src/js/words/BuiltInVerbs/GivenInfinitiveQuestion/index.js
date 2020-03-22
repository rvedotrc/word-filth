import React from 'react';

import QuestionForm from './question_form';

class GivenInfinitiveQuestion {

    constructor(infinitive, verbs) {
        this.infinitive = infinitive;
        this.verbs = verbs;

        const uniq = {};
        verbs.map(v => v.engelsk).filter(v => v).map(e => uniq[e] = true);
        const text = Object.keys(uniq).sort().join('; ');
        if (text !== '') this.engelsk = text;

        // If we didn't store the infinitive with the particle too,
        // this wouldn't be necessary!
        this.resultsKey = infinitive.replace(/^(at|å) /, 'verb-infinitiv-');
        this.resultsLabel = infinitive;
        this.answersLabel = verbs.map(v => v.tekst).sort().join("; ");
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.question = this;
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenInfinitiveQuestion;
