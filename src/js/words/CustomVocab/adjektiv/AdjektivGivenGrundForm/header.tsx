import * as React from 'react';
import AdjektivGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";

const Header = (props: QuestionHeaderProps<T, C, AdjektivGivenEnglish>) =>
    <p>
        {props.t('question.adjective_given_grund_form.question', {
            skipInterpolation: true,
            postProcess: 'pp',
            grundForm: <>
                <b>{props.question.grundForm}</b>
                {props.question.engelsk && (<> ({props.question.engelsk})</>)}
            </>
        })}
    </p>;

export default Header;
