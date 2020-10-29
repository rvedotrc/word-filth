import * as React from 'react';
import {useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "../../types";
import GenderInput from "@components/shared/gender_input";
import * as Bøjning from "lib/bøjning";

const Form = (ubestemtEntal: string) => (props: QuestionFormProps<T>) => {
    const {t} = props;

    const [fields, setFields] = useState<T>({
        køn: "",
        bestemtEntal: "",
        ubestemtFlertal: "",
        bestemtFlertal: "",
    });

    const onUpdate = (field: keyof T, value: string) => {
        const newFields = {
            ...fields,
            [field]: value,
        };
        setFields(newFields);

        const exp = (s: string | null) =>
            Bøjning.bøj(ubestemtEntal, s?.trim() || "") || null;

        const attempt: T = {
            køn: newFields.køn,
            bestemtEntal: exp(newFields.bestemtEntal) || '',
            ubestemtFlertal: exp(newFields.ubestemtFlertal) || '',
            bestemtFlertal: exp(newFields.bestemtFlertal) || '',
        };

        if (attempt.køn) {
            props.onAttempt(attempt);
        } else {
            props.onAttempt(undefined);
        }
    };

    const expand = (field: keyof T) =>
        setFields({
            ...fields,
            [field]: Bøjning.bøj(ubestemtEntal, fields[field]?.trim() || ""),
        });

    const addInput = (field: keyof T, autoFocus: boolean=false) => (
        <div>
            <label>
                <span>{t(`question.substantiv.given_ubestemt_ental.${field}.label`)}</span>
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
            <div>
                <label>
                    <span>{t('question.substantiv.given_ubestemt_ental.gender.label')}</span>
                    <GenderInput
                        value={fields.køn}
                        onChange={v => onUpdate('køn', v || "")}
                        autoFocus={true}
                        data-testid="køn"
                    />
                </label>
            </div>
            {addInput("bestemtEntal")}
            {addInput("ubestemtFlertal")}
            {addInput("bestemtFlertal")}
        </div>
    );
}

export default Form;