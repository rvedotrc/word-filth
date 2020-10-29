import * as React from 'react';
import {C} from ".";
import {CorrectResponseRendererProps} from "../../types";

const CorrectResponse = (props: CorrectResponseRendererProps<C>) =>
    <ul>{
        /* Ordering? */
        props.correct.map((c, index) =>
            <li key={index}>
                {c.nutid.join('/')},{' '}
                {c.datid.join('/')},{' '}
                {c.førnutid.join('/')}
            </li>
        )
    }</ul>;

export default CorrectResponse;
