import * as React from 'react';
import VerbumGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";
import VocabTypeLabel from "@components/shared/vocab_type_label";

const Header = (props: QuestionHeaderProps<T, C, VerbumGivenEnglish>) =>
    <>
        <p>
            {props.t('question.substantiv.given_ubestemt.question', {
                skipInterpolation: true,
                postProcess: 'pp',
                ubestemt: <b>{props.question.ubestemt}</b>,
            })}
        </p>
        <VocabTypeLabel type={"substantiv"}/>
    </>;

export default Header;
