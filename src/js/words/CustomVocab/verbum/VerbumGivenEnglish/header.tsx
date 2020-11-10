import * as React from 'react';
import VerbumGivenEnglish , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";
import VocabTypeLabel from "@components/shared/vocab_type_label";

const Header = (props: QuestionHeaderProps<T, C, VerbumGivenEnglish>) =>
    <>
        <p>
            {props.t('question.shared.how_do_you_say_in_danish', {
                skipInterpolation: true,
                postProcess: 'pp',
                english: <b>{props.question.english}</b>
            })}
        </p>
        <VocabTypeLabel type={"verbum"}/>
    </>;

export default Header;
