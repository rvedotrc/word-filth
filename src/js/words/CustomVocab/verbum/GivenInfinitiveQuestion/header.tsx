import * as React from 'react';
import GivenInfinitiveQuestion , {T, C} from ".";
import {QuestionHeaderProps} from "../../types";

const Header = (props: QuestionHeaderProps<T, C, GivenInfinitiveQuestion>) =>
    <p>
        How do you form the verb,{' '}
        <b>{props.question.infinitive}</b>?
    </p>;

export default Header;
