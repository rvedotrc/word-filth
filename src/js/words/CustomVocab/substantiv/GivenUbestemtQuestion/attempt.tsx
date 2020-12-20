import * as React from 'react';
import {T} from ".";
import {AttemptRendererProps} from "lib/types/question";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>{
        [
            props.attempt.køn,
            props.attempt.bestemtEntal,
            props.attempt.ubestemtFlertal,
            props.attempt.bestemtFlertal,
        ].filter(s => s).join(', ')
    }</>;

export default Attempt;
