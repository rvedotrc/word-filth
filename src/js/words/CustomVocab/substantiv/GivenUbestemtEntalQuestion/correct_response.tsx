import * as React from 'react';
import {C} from ".";
import {CorrectResponseRendererProps} from "../../types";

const CorrectResponse = (props: CorrectResponseRendererProps<C>) =>
    <ul>{
        /* Ordering? */
        props.correct.map((c, index) =>
            <li key={index}>
                {[
                    c.køn,
                    c.bestemtEntal,
                    c.ubestemtFlertal,
                    c.bestemtFlertal,
                ].filter(s => s).join(', ')}
            </li>
        )
    }</ul>;

export default CorrectResponse;
