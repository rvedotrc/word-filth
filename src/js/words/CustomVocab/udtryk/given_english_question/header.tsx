import * as React from 'react';
import GivenEnglishQuestion, {T, C} from "./given_english_question";
import {QuestionHeaderProps} from "../../types";

const Header = (props: QuestionHeaderProps<T, C, GivenEnglishQuestion>) =>
    <p>
        How do you say in Danish,
        <b>{props.question.englishQuestion}</b>?
    </p>;

export default Header;
