import * as React from 'react';
import VerbumGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";

const Header = (props: QuestionHeaderProps<T, C, VerbumGivenEnglish>) =>
    <p>
        {props.t('question.shared.how_do_you_say_in_english', {
            skipInterpolation: true,
            postProcess: 'pp',
            danish: <span>
                {props.question.køn !== 'pluralis' ? (
                    <span>({props.question.køn}) <b>{props.question.ubestemtEntalEllerFlertal}</b></span>
                ) : (
                    <b>{props.question.ubestemtEntalEllerFlertal}</b>
            )}</span>,
        })}
    </p>;

export default Header;
