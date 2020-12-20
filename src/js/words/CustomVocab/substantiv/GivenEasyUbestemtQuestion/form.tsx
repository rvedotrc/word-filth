import * as React from 'react';
import {useRef, useState} from 'react';
import {QuestionFormProps} from "lib/types/question";
import GenderInput from "@components/shared/gender_input";
import * as Bøjning from "lib/bøjning";
import * as Gender from "lib/gender";
import {T} from ".";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./form.css");

type F = {
    køn: Gender.Type | null;
    ubestemtEntal: string;
    bestemtEntal: string;
}

const Form = (ubestemtEntal: string, vocabLang: string) => (props: QuestionFormProps<T>) => {
    const {t} = props;

    const idPrefix = useRef(`id-${new Date().getTime()}`);

    const [fields, setFields] = useState<F>({
        køn: null,
        ubestemtEntal: "",
        bestemtEntal: "",
    });

    const onUpdate = (field: keyof T, value: string) => {
        const newFields = {
            ...fields,
            [field]: value,
        };
        setFields(newFields);

        const exp = (s: string | null) =>
            Bøjning.bøj(ubestemtEntal, s?.trim() || "") || null;

        const attempt: F = {
            køn: newFields.køn,
            ubestemtEntal: exp(newFields.ubestemtEntal) || '',
            bestemtEntal: exp(newFields.bestemtEntal) || '',
        };

        if (attempt.køn) {
            props.onAttempt({ ...attempt, køn: attempt.køn });
        } else {
            props.onAttempt(undefined);
        }
    };

    const expand = (field: keyof T) =>
        setFields({
            ...fields,
            [field]: Bøjning.bøj(ubestemtEntal, fields[field]?.trim() || ""),
        });

    const addInput = (field: keyof T, autoFocus=false) => (
        <>
            <label htmlFor={`${idPrefix.current}-${field}`}>
                {t(`question.substantiv.given_ubestemt.${field}.label`)}
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
                {t('question.substantiv.given_ubestemt.gender.label')}
            </label>
            <GenderInput
                id={`${idPrefix.current}-køn`}
                value={fields.køn}
                onChange={v => onUpdate('køn', v || "")}
                autoFocus={true}
                data-testid="køn"
            />
            {addInput("ubestemtEntal")}
            {addInput("bestemtEntal")}
        </div>
    );
}

export default Form;
