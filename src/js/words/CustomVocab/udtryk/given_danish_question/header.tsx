import * as React from 'react';
import GivenDanishQuestion, {T, C} from "./given_danish_question";
import {QuestionHeaderProps} from "../../types";

const Header = (props: QuestionHeaderProps<T, C, GivenDanishQuestion>) =>
    <p>
        How do you say in English,
        <b>{props.question.danishQuestion}</b>?
    </p>;

export default Header;
