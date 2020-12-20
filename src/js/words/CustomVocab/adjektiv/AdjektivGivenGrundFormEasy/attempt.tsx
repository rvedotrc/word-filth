import * as React from 'react';
import {T} from ".";
import {AttemptRendererProps} from "lib/types/question";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>
        {props.attempt.tForm}, {props.attempt.langForm}
    </>;

export default Attempt;
