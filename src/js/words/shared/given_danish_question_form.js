import React from 'react';

import GivenOneLanguageAnswerTheOther from './given_one_language_answer_the_other';

class GivenDanishQuestionForm extends GivenOneLanguageAnswerTheOther {
    // TODO: t

    questionPhrase(q) {
        return (<span>Hvordan siger man på engelsk, <b>{q}</b>?</span>);
    }

    answerLabel() {
        return "Engelsk:";
    }
}

export default GivenDanishQuestionForm;
