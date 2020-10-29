import * as React from 'react';
import {T} from ".";
import {AttemptRendererProps} from "../../CustomVocab/types";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>{props.attempt.dansk}</>;

export default Attempt;
