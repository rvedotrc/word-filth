import * as React from 'react';
import GivenDanishQuestion, {AT} from "../given_danish_question";
import {QuestionHeaderProps} from "../../types";

const Header = (props: QuestionHeaderProps<AT, GivenDanishQuestion>) =>
    <p>
        How do you say in English,
        <b>{props.question.danishQuestion}</b>?
    </p>;

export default Header;
