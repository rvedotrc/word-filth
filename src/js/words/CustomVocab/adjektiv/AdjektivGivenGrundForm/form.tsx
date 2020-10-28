import * as React from 'react';
import {useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "../../types";

const Form = (props: QuestionFormProps<T>) => {
    const [fields, setFields] = useState<T>({
        tForm: "",
        langForm: "",
        komparativ: "",
        superlativ: "",
    });

    const onUpdate = (field: keyof T, value: string) => {
        const newFields = {
            ...fields,
            [field]: value,
        };
        setFields(newFields);

        const attempt: T = {
            tForm: newFields.tForm.trim(),
            langForm: newFields.langForm.trim(),
            komparativ: newFields.komparativ?.trim() || null,
            superlativ: newFields.superlativ?.trim() || null,
        };

        if (attempt.tForm && attempt.langForm && (!!attempt.komparativ === !!attempt.superlativ)) {
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
                value={fields[field] || ''}
                autoFocus={autoFocus}
                onChange={e => onUpdate(field, e.target.value)}
            />
        </label>
    );

    return (
        <div>
            {addInput("tForm", true)}
            {addInput("langForm")}
            {addInput("komparativ")}
            {addInput("superlativ")}
        </div>
    );
}

export default Form;
