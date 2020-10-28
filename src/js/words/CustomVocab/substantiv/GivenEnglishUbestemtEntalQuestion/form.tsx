import * as React from 'react';
import {useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "../../types";
import GenderInput from "@components/shared/gender_input";

const Form = (props: QuestionFormProps<T>) => {
    const [fields, setFields] = useState<T>({
        køn: "",
        ubestemtEntal: "",
    });

    const onUpdate = (field: keyof T, value: string) => {
        const newFields = {
            ...fields,
            [field]: value,
        };
        setFields(newFields);

        const attempt: T = {
            køn: newFields.køn,
            ubestemtEntal: newFields.ubestemtEntal.trim(),
        };

        if (attempt.køn && attempt.ubestemtEntal) {
            props.onAttempt(attempt);
        } else {
            props.onAttempt(undefined);
        }
    };

    const addInput = (field: keyof T, autoFocus: boolean=false) => (
        <label>
            <span>{field}:</span>
            <input
                value={fields[field] || ''}
                autoFocus={autoFocus}
                onChange={e => onUpdate(field, e.target.value)}
            />
        </label>
    );

    return (
        <div>
            Køn:
            <GenderInput
                value={fields.køn}
                onChange={v => onUpdate('køn', v || "")}
                autoFocus={true}
                data-testid="køn"
            />
            {addInput("ubestemtEntal")}
        </div>
    );
}

export default Form;
