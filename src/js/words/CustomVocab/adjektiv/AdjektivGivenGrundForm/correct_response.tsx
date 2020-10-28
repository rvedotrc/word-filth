import * as React from 'react';
import {C} from ".";
import {CorrectResponseRendererProps} from "../../types";

const CorrectResponse = (props: CorrectResponseRendererProps<C>) =>
    <ul>{
        /* Ordering? */
        props.correct.map((c, index) =>
            <li key={index}>
                {c.tForm}, {c.langForm}
                {c.komparativ && <>, {c.komparativ}</>}
                {c.superlativ && <>, {c.superlativ}</>}
            </li>
        )
    }</ul>;

export default CorrectResponse;
