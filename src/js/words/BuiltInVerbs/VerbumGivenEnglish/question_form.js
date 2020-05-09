import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import GivenOneLanguageAnswerTheOther from '../../shared/given_one_language_answer_the_other';
import TextTidier from "../../../shared/text_tidier";

class QuestionForm extends GivenOneLanguageAnswerTheOther {

    questionPhrase(q) {
        const { t } = this.props;
        return (<span>
            {t('question.shared.how_do_you_say_in_danish', {
                skipInterpolation: true,
                postProcess: 'pp',
                english: <b>{q}</b>
            })}
        </span>);
    }

    checkAnswer(givenAnswer) {
        const particleRE = {
            'da': /^at\s+/,
            'no': /^å\s+/,
        }[this.props.lang];

        const normalise = t => TextTidier.normaliseWhitespace(t)
            .toLowerCase()
            .replace(particleRE, '');

        return this.props.allowableAnswers.some(allowableAnswer =>
            normalise(allowableAnswer) === normalise(givenAnswer)
        );
    }

    answerLabel() {
        // const { t } = this.props;
        // TODO: i18n
        return 'Danish:';
    }

}

QuestionForm.propTypes = {
    ...GivenOneLanguageAnswerTheOther.propTypes,
    lang: PropTypes.string.isRequired,
};

export default withTranslation()(QuestionForm);
