import * as React from 'react';
import AdjektivGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "../../types";

/* TODO: i18n */
const Header = (props: QuestionHeaderProps<T, C, AdjektivGivenEnglish>) =>
    <p>
        How do you form the adjective{' '}
        <b key="grundForm">{props.question.grundForm}</b>
        {props.question.engelsk && (<span> ({props.question.engelsk})</span>)}
        ?
    </p>;

export default Header;
