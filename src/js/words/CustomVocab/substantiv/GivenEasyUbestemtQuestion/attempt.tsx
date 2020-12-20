import * as React from 'react';
import {T} from ".";
import {AttemptRendererProps} from "lib/types/question";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>{
        [
            props.attempt.køn,
            props.attempt.ubestemtEntal,
            props.attempt.bestemtEntal,
        ].map(s => s || '-').join(', ')
    }</>;

export default Attempt;
