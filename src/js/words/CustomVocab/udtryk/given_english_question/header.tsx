import * as React from 'react';
import GivenEnglishQuestion, {T, C} from ".";
import {QuestionHeaderProps} from "../../types";

const Header = (props: QuestionHeaderProps<T, C, GivenEnglishQuestion>) =>
    <p>
        {props.t('question.shared.how_do_you_say_in_danish', {
            skipInterpolation: true,
            postProcess: 'pp',
            english: <b>{props.question.englishQuestion}</b>
        })}
    </p>;

export default Header;
