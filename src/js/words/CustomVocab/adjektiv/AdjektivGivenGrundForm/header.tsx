import * as React from 'react';
import AdjektivGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";
import VocabTypeLabel from "@components/shared/vocab_type_label";

const Header = (props: QuestionHeaderProps<T, C, AdjektivGivenEnglish>) =>
    <>
        <p>
            {props.t('question.adjective_given_grund_form.question', {
                skipInterpolation: true,
                postProcess: 'pp',
                grundForm: <>
                    <b>{props.question.grundForm}</b>
                    {props.question.engelsk && (<> ({props.question.engelsk})</>)}
                </>
            })}
        </p>
        <VocabTypeLabel type={"adjektiv"}/>
    </>;

export default Header;
