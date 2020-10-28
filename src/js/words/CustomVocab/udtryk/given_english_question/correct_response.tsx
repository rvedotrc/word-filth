import * as React from 'react';
import GivenEnglishQuestion , {AT} from "./given_english_question";
import {unique} from "lib/unique-by";
import {CorrectResponseRendererProps} from "../../types";

const CorrectResponse = (props: CorrectResponseRendererProps<AT, GivenEnglishQuestion>) =>
    <ol>{unique(props.question.danishAnswers).sort().map((answer, index) =>
        <li key={index}>{answer}</li>
    )}</ol>;

export default CorrectResponse;
