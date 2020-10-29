import * as React from 'react';
import AdjektivGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "../../types";

const Header = (props: QuestionHeaderProps<T, C, AdjektivGivenEnglish>) =>
    <p>
        {props.t('question.shared.how_do_you_say_in_danish', {
            skipInterpolation: true,
            postProcess: 'pp',
            english: <b>{props.question.english}</b>
        })}
    </p>;

export default Header;
