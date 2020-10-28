import * as React from 'react';
import {T} from ".";
import {AttemptRendererProps} from "../../types";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>
        {props.attempt.køn === 'pluralis'
            ? '[pluralis]'
            : props.attempt.køn
        }
        {' '}
        {props.attempt.ubestemtEntal}
    </>;

export default Attempt;
