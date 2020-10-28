import * as React from 'react';
import {useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "../../types";
import * as Bøjning from "lib/bøjning";
import {expandVerbum} from "lib/bøjning";

const Form = (infinitiv: string) => (props: QuestionFormProps<T>) => {
    const {t} = props;

    const [fields, setFields] = useState<T>({
        nutid: "",
        datid: "",
        førnutid: "",
    });

    const onUpdate = (field: keyof T, value: string, primary: boolean) => {
        let newFields = {
            ...fields,
            [field]: value,
        };

        if (primary) {
            const result = expandVerbum(infinitiv, value);
            if (result) newFields = result;
        }

        setFields(newFields);

        const exp = (s: string | null) =>
            Bøjning.bøj(infinitiv, s?.trim() || "") || "";

        const attempt: T = {
            nutid: exp(newFields.nutid),
            datid: exp(newFields.datid),
            førnutid: exp(newFields.førnutid),
        };

        if (attempt.nutid && attempt.datid && attempt.førnutid) {
            props.onAttempt(attempt);
        } else {
            props.onAttempt(undefined);
        }
    };

    const expand = (field: keyof T) =>
        setFields({
            ...fields,
            [field]: Bøjning.bøj(infinitiv, fields[field]?.trim() || ""),
        });

    const addInput = (field: keyof T, primary: boolean=false) => (
        <div>
            <label>
                <span>{t(`question.builtin_verb.given_infinitive.${field}.label`)}</span>
                <input
                    value={fields[field]}
                    autoFocus={primary}
                    onChange={e => onUpdate(field, e.target.value, primary)}
                    onBlur={() => expand(field)}
                />
            </label>
        </div>
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
