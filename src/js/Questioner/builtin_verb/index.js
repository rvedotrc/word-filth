import React from 'react';

import QuestionForm from './question_form';
import verbList from './verb-list.json';

class BuiltinVerb {

    static getQuestions() {
        const infinitives = {};
        verbList.verber.map(v => { infinitives[v.infinitiv] = true });

        return Object.keys(infinitives).map(infinitive => {
            const matchingVerbs = verbList.verber.filter(v => v.infinitiv === infinitive);
            return new BuiltinVerb(infinitive, matchingVerbs);
        });
    }

    constructor(infinitive, verbs) {
        this.infinitive =infinitive;
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

export default BuiltinVerb;
