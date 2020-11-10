import * as React from 'react';
import {useRef, useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "lib/types/question";
import * as Bøjning from "lib/bøjning";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./form.css");

const Form = (grundForm: string, vocabLang: string) => (props: QuestionFormProps<T>) => {
    const {t} = props;

    const idPrefix = useRef(`id-${new Date().getTime()}`);

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

    const addInput = (field: keyof T, autoFocus=false) => (
        <>
            <label htmlFor={`${idPrefix}-${field}`}>
                {t(`question.adjective_given_grund_form.${field}.label`)}
            </label>
            <input
                id={`${idPrefix}-${field}`}
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
            {addInput("tForm", true)}
            {addInput("langForm")}
            {addInput("komparativ")}
            {addInput("superlativ")}
        </div>
    );
}

export default Form;
