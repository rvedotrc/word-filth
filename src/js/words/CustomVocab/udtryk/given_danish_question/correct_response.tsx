import * as React from 'react';
import {C} from "./given_danish_question";
import {unique} from "lib/unique-by";
import {CorrectResponseRendererProps} from "../../types";

const CorrectResponse = (props: CorrectResponseRendererProps<C>) =>
    <ol>{
        unique(props.correct.map(c => c.engelsk))
            .sort()
            .map((answer, index) =>
                <li key={index}>{answer}</li>
            )
    }</ol>;

export default CorrectResponse;
