import * as React from 'react';
import {useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "../../types";
import * as Bøjning from "lib/bøjning";

const Form = (grundForm: string) => (props: QuestionFormProps<T>) => {
    const {t} = props;

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

        const exp = (s: string | null) =>
            Bøjning.bøj(grundForm, s?.trim() || "") || null;

        const attempt: T = {
            tForm: exp(newFields.tForm) || "",
            langForm: exp(newFields.langForm) || "",
            komparativ: exp(newFields.komparativ),
            superlativ: exp(newFields.superlativ),
        };

        if (attempt.tForm && attempt.langForm && (!!attempt.komparativ === !!attempt.superlativ)) {
            props.onAttempt(attempt);
        } else {
            props.onAttempt(undefined);
        }
    };

    const expand = (field: keyof T) =>
        setFields({
            ...fields,
            [field]: Bøjning.bøj(grundForm, fields[field]?.trim() || ""),
        });

    const addInput = (field: keyof T, autoFocus: boolean=false) => (
        <div>
            <label>
                <span>{t(`question.adjective_given_grund_form.${field}.label`)}</span>
                <input
                    value={fields[field] || ''}
                    autoFocus={autoFocus}
                    onChange={e => onUpdate(field, e.target.value)}
                    onBlur={() => expand(field)}
                />
            </label>
        </div>
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
