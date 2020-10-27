import * as React from 'react';
import {AT} from "../given_english_question";
import {AttemptRendererProps} from "../../types";

const Attempt = (props: AttemptRendererProps<AT>) =>
    <>{props.attempt.dansk}</>;

export default Attempt;
