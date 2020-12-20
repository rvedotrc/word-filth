import * as React from 'react';
import VerbumGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";
import VocabTypeLabel from "@components/shared/vocab_type_label";

const Header = (props: QuestionHeaderProps<T, C, VerbumGivenEnglish>) =>
    <>
        <p>
            {props.t(`question.shared.how_do_you_say_in_${props.question.lang}`, {
                skipInterpolation: true,
                postProcess: 'pp',
                english: <b>{props.question.engelsk}</b>,
            })}
        </p>
        <VocabTypeLabel type={"substantiv"}/>
    </>;

export default Header;
