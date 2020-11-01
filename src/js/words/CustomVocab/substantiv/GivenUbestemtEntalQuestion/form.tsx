import * as React from 'react';
import {useRef, useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "../../types";
import GenderInput from "@components/shared/gender_input";
import * as Bøjning from "lib/bøjning";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./form.css");

const Form = (ubestemtEntal: string, vocabLang: string) => (props: QuestionFormProps<T>) => {
    const {t} = props;

    const idPrefix = useRef(`id-${new Date().getTime()}`);

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
        <>
            <label htmlFor={`${idPrefix.current}-${field}`}>
                {t(`question.substantiv.given_ubestemt_ental.${field}.label`)}
            </label>
            <input
                id={`${idPrefix.current}-${field}`}
                value={fields[field] || ''}
                autoFocus={autoFocus}
                onChange={e => onUpdate(field, e.target.value)}
                onBlur={() => expand(field)}
                spellCheck={"false"}
                autoCapitalize={'none'}
                autoComplete={'off'}
                autoCorrect={'off'}
                lang={vocabLang}
            />
        </>
    );

    return (
        <div className={styles.grid}>
            <label htmlFor={`${idPrefix.current}-køn`}>
                {t('question.substantiv.given_ubestemt_ental.gender.label')}
            </label>
            <GenderInput
                id={`${idPrefix.current}-køn`}
                value={fields.køn}
                onChange={v => onUpdate('køn', v || "")}
                autoFocus={true}
                data-testid="køn"
            />
            {addInput("bestemtEntal")}
            {addInput("ubestemtFlertal")}
            {addInput("bestemtFlertal")}
        </div>
    );
}

export default Form;
