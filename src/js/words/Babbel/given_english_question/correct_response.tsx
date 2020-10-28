import * as React from 'react';
import {C} from ".";
import {CorrectResponseRendererProps} from "../../CustomVocab/types";

const CorrectResponse = (props: CorrectResponseRendererProps<C>) =>
    <ul>{
        /* Ordering? */
        props.correct.map((c, index) =>
            <li key={index}>
                {c.dansk}
            </li>
        )
    }</ul>;

export default CorrectResponse;
