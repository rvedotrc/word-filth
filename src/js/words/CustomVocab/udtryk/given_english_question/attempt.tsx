import * as React from 'react';
import {T} from "./given_english_question";
import {AttemptRendererProps} from "../../types";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>{props.attempt.dansk}</>;

export default Attempt;
