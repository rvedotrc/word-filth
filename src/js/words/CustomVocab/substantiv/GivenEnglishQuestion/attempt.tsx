import * as React from 'react';
import {T} from ".";
import {AttemptRendererProps} from "lib/types/question";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>
        {props.attempt.køn === 'pluralis'
            ? '[pluralis]'
            : props.attempt.køn
        }
        {' '}
        {props.attempt.ubestemt}
    </>;

export default Attempt;
