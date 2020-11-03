import * as React from 'react';
import GivenInfinitiveQuestion , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";

const Header = (props: QuestionHeaderProps<T, C, GivenInfinitiveQuestion>) =>
    <p>
        {props.t('question.builtin_verb.given_infinitive.question', {
            skipInterpolation: true,
            postProcess: 'pp',
            infinitive: <b>{props.question.infinitive}</b>,
        })}
    </p>;

export default Header;
