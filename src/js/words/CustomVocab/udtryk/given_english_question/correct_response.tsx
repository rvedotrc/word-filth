import * as React from 'react';
import {C} from "./given_english_question";
import {unique} from "lib/unique-by";
import {CorrectResponseRendererProps} from "../../types";

const CorrectResponse = (props: CorrectResponseRendererProps<C>) =>
    <ol>{
        unique(props.correct.map(c => c.dansk))
            .sort()
            .map((answer, index) =>
                <li key={index}>{answer}</li>
            )
    }</ol>;

export default CorrectResponse;
