import * as React from 'react';
import {C} from ".";
import {unique} from "lib/unique-by";
import {CorrectResponseRendererProps} from "../../types";

const CorrectResponse = (props: CorrectResponseRendererProps<C>) =>
    <ul>{
        unique(props.correct.map(c => c.engelsk))
            .sort()
            .map((answer, index) =>
                <li key={index}>{answer}</li>
            )
    }</ul>;

export default CorrectResponse;
