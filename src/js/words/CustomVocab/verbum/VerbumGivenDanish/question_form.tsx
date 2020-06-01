import * as React from 'react';
import { withTranslation } from 'react-i18next';

import GivenOneLanguageAnswerTheOther, { Attempt } from '../../../shared/given_one_language_answer_the_other';
import TextTidier from "../../../../shared/text_tidier";

class QuestionForm extends GivenOneLanguageAnswerTheOther {

    questionPhrase(q: string) {
        const { t } = this.props;
        // TODO i18n
        return (<span>
            {t('question.shared.how_do_you_say_in_english', {
                skipInterpolation: true,
                postProcess: 'pp',
                danish: <b>{q}</b>
            })}
        </span>);
    }

    checkAnswer(givenAnswer: Attempt) {
        const normalise = (t: string) => TextTidier.normaliseWhitespace(t)
            .toLowerCase()
            .replace(/^to /, '');

        return this.props.allowableAnswers.some(allowableAnswer =>
            normalise(allowableAnswer.replace(/ \[.*\]$/, '')) === normalise(givenAnswer)
        );
    }

    answerLabel() {
        const { t } = this.props;
        return t('question.shared.label.english');
    }

}

export default withTranslation()(QuestionForm);
