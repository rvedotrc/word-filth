import * as React from 'react';
import VerbumGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";

const Header = (props: QuestionHeaderProps<T, C, VerbumGivenEnglish>) =>
    <p>
        {props.t('question.shared.how_do_you_say_in_danish', {
            skipInterpolation: true,
            postProcess: 'pp',
            english: <b>{
                props.question.engelsk.match(/^[aeiou]/)
                    ? 'an'
                    : 'a'
            } {props.question.engelsk}</b>,
        })}
    </p>;

export default Header;
