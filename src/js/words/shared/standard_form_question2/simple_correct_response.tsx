import * as React from 'react';
import {unique} from "lib/unique-by";

const SimpleCorrectResponse = (props: { correct: string[] }) =>
    <ul>{
        unique(props.correct).sort(
            (a, b) => a.localeCompare(b)
        ).map((c, index) =>
            <li key={index}>
                {c}
            </li>
        )
    }</ul>;

export default SimpleCorrectResponse;
