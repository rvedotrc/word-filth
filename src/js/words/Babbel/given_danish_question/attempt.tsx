import * as React from 'react';
import {T} from ".";
import {AttemptRendererProps} from "../../CustomVocab/types";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>{props.attempt.engelsk}</>;

export default Attempt;
