import * as React from 'react';
import GivenDanishQuestion, {AT} from "../given_danish_question";
import {unique} from "lib/unique-by";
import {CorrectResponseRendererProps} from "../../types";

const CorrectResponse = (props: CorrectResponseRendererProps<AT, GivenDanishQuestion>) =>
    <ol>{unique(props.question.englishAnswers).sort().map((answer, index) =>
        <li key={index}>{answer}</li>
    )}</ol>;

export default CorrectResponse;
