import React from 'react';

import GivenOneLanguageAnswerTheOther from './given_one_language_answer_the_other';

class GivenEnglishQuestionForm extends GivenOneLanguageAnswerTheOther {
    // TODO: t

    questionPhrase(q) {
        return (<span>Hvordan siger man på dansk, <b>{q}</b>?</span>);
    }

    answerLabel() {
        return "Dansk:";
    }
}

export default GivenEnglishQuestionForm;
