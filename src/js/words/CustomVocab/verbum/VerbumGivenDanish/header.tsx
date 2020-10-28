import * as React from 'react';
import GivenInfinitiveQuestion , {T, C} from ".";
import {QuestionHeaderProps} from "../../types";

const Header = (props: QuestionHeaderProps<T, C, GivenInfinitiveQuestion>) =>
    <p>
        {props.t('question.shared.how_do_you_say_in_english', {
            skipInterpolation: true,
            postProcess: 'pp',
            danish: <b>{props.question.infinitiv}</b>
        })}
    </p>;

export default Header;
