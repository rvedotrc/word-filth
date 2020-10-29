import * as React from 'react';
import {T} from ".";
import {AttemptRendererProps} from "../../types";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>
        {props.attempt.tForm}, {props.attempt.langForm}
        {props.attempt.komparativ && <>, {props.attempt.komparativ}</>}
        {props.attempt.superlativ && <>, {props.attempt.superlativ}</>}
    </>;

export default Attempt;