import * as React from 'react';
import GivenInfinitiveQuestion , {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";
import VocabTypeLabel from "@components/shared/vocab_type_label";

const Header = (props: QuestionHeaderProps<T, C, GivenInfinitiveQuestion>) =>
    <>
        <p>
            {props.t('question.builtin_verb.given_infinitive.question', {
                skipInterpolation: true,
                postProcess: 'pp',
                infinitive: <b>{props.question.infinitive}</b>,
            })}
        </p>
        <VocabTypeLabel type={"verbum"}/>
    </>;

export default Header;
