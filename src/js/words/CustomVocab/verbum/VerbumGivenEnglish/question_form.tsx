import * as React from 'react';
import { withTranslation } from 'react-i18next';

import GivenOneLanguageAnswerTheOther, { Attempt } from '../../../shared/given_one_language_answer_the_other';
import TextTidier from "lib/text_tidier";

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

    checkAnswer(givenAnswer: Attempt) {
        const particleRE = ({
            'da': /^at\s+/,
            'no': /^å\s+/,
        } as any)[this.props.lang]; // FIXME-any

        const normalise = (t: string) => TextTidier.normaliseWhitespace(t)
            .toLowerCase()
            .replace(particleRE, '');

        return this.props.allowableAnswers.some(allowableAnswer =>
            normalise(allowableAnswer) === normalise(givenAnswer)
        );
    }

    answerLabel() {
        return this.props.t('question.shared.label.danish');
    }

}

export default withTranslation()(QuestionForm);
