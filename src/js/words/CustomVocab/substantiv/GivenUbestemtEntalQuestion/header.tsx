import * as React from 'react';
import VerbumGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";

const Header = (props: QuestionHeaderProps<T, C, VerbumGivenEnglish>) =>
    <p>
        {props.t('question.substantiv.given_ubestemt_ental.question', {
            skipInterpolation: true,
            postProcess: 'pp',
            ubestemtEntal: <b>{props.question.ubestemtEntal}</b>,
        })}
    </p>;

export default Header;
