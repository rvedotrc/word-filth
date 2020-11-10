import * as React from 'react';
import GivenDanishQuestion, {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";
import VocabTypeLabel from "@components/shared/vocab_type_label";

const Header = (props: QuestionHeaderProps<T, C, GivenDanishQuestion>) =>
    <>
        <p>
            {props.t('question.shared.how_do_you_say_in_english', {
                skipInterpolation: true,
                postProcess: 'pp',
                danish: <b>{props.question.danishQuestion}</b>
            })}
        </p>
        <VocabTypeLabel type={"udtryk"}/>
    </>;

export default Header;
