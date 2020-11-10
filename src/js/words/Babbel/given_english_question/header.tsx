import * as React from 'react';
import GivenEnglishQuestion, {T, C} from ".";
import {QuestionHeaderProps} from "lib/types/question";
import VocabTypeLabel from "@components/shared/vocab_type_label";

const makePrompt = (q: GivenEnglishQuestion): string => {
    let prompt = q.englishQuestion;

    if (!q.englishQuestion.match(/^(a|an) /) && q.danishAnswers.some(t => t.match(/^(en|et) /))) {
        prompt = prompt + " [en/et ...]";
    }

    return prompt;
}

const Header = (props: QuestionHeaderProps<T, C, GivenEnglishQuestion>) =>
    <>
        <p>
            {props.t('question.shared.how_do_you_say_in_danish', {
                skipInterpolation: true,
                postProcess: 'pp',
                english: <b>{makePrompt(props.question)}</b>
            })}
        </p>
        <VocabTypeLabel type={"babbel"}/>
    </>;

export default Header;
