import * as React from 'react';
import { withTranslation } from 'react-i18next';

import GivenOneLanguageAnswerTheOther from '../../../shared/given_one_language_answer_the_other';

class QuestionForm extends GivenOneLanguageAnswerTheOther {

    questionPhrase(q: string) {
        const { t } = this.props;
        return (<span>
            {t('question.shared.how_do_you_say_in_danish', {
                skipInterpolation: true,
                postProcess: 'pp',
                english: <b>{q}</b>
            })}
        </span>);
    }

    answerLabel() {
        // const { t } = this.props;
        // TODO: i18n
        return 'Danish (grund form):';
    }

}

export default withTranslation()(QuestionForm);
