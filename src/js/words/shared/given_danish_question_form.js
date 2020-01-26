import React from 'react';
import { withTranslation } from 'react-i18next';

import GivenOneLanguageAnswerTheOther from './given_one_language_answer_the_other';

class GivenDanishQuestionForm extends GivenOneLanguageAnswerTheOther {
    questionPhrase(q) {
        const { t } = this.props;
        return (<span>
            {t('question.shared.how_do_you_say_in_english', {
                skipInterpolation: true,
                postProcess: 'pp',
                danish: <b key="dansk">{q}</b>
            })}
        </span>);
    }

    answerLabel() {
        const { t } = this.props;
        return t('question.shared.label.english');
    }
}

export default withTranslation()(GivenDanishQuestionForm);
