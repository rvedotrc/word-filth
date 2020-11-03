import * as React from 'react';
import GivenDanishQuestion, {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";

const Header = (props: QuestionHeaderProps<T, C, GivenDanishQuestion>) =>
    <p>
        {props.t('question.shared.how_do_you_say_in_english', {
            skipInterpolation: true,
            postProcess: 'pp',
            danish: <b>{props.question.danishQuestion}</b>
        })}
    </p>;

export default Header;
