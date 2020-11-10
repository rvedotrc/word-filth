import * as React from 'react';
import AdjektivGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";
import VocabTypeLabel from "@components/shared/vocab_type_label";

const Header = (props: QuestionHeaderProps<T, C, AdjektivGivenEnglish>) =>
    <>
        <p>
            {props.t(`question.shared.how_do_you_say_in_${props.question.lang}`, {
                skipInterpolation: true,
                postProcess: 'pp',
                english: <b>{props.question.english}</b>
            })}
        </p>
        <VocabTypeLabel type={"adjektiv"}/>
    </>;

export default Header;
