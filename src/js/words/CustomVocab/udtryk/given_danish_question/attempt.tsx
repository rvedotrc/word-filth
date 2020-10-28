import * as React from 'react';
import {T} from "./given_danish_question";
import {AttemptRendererProps} from "../../types";

const Attempt = (props: AttemptRendererProps<T>) =>
    <>{props.attempt.engelsk}</>;

export default Attempt;
