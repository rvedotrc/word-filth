import * as React from 'react';
import {T} from ".";
import {AttemptRendererProps} from "lib/types/question";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>{props.attempt.nutid}, {props.attempt.datid}, {props.attempt.førnutid}</>;

export default Attempt;
