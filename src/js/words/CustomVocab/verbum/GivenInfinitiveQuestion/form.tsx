import * as React from 'react';
import {useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "../../types";

const Form = (props: QuestionFormProps<T>) => {
    const [fields, setFields] = useState<T>({
        nutid: "",
        datid: "",
        førnutid: "",
    });

    const onUpdate = (field: keyof T, value: string) => {
        const newFields = {
            ...fields,
            [field]: value,
        };
        setFields(newFields);

        const attempt: T = {
            nutid: newFields.nutid.trim(),
            datid: newFields.datid.trim(),
            førnutid: newFields.førnutid.trim(),
        };

        if (attempt.nutid && attempt.datid && attempt.førnutid) {
            props.onAttempt(attempt);
        } else {
            props.onAttempt(undefined);
        }
    };

    // TODO: '1', '2', and -/.. expansion
    const addInput = (field: keyof T, autoFocus: boolean=false) => (
        <label>
            <span>{field}:</span>
            <input
                value={fields[field]}
                autoFocus={autoFocus}
                onChange={e => onUpdate(field, e.target.value)}
            />
        </label>
    );

    return (
        <div>
            {addInput("nutid", true)}
            {addInput("datid")}
            {addInput("førnutid")}
        </div>
    );
}

export default Form;
