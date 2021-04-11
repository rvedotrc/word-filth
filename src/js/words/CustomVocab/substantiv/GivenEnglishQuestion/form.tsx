import * as React from 'react';
import {useRef, useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "lib/types/question";
import GenderInput from "@components/shared/gender_input";
import * as Gender from "lib/gender";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./form.css");

type F = {
    køn: Gender.Type | null;
    ubestemt: string;
}

const Form = (vocabLang: string) => (props: QuestionFormProps<T>) => {
    const {t} = props;

    const [fields, setFields] = useState<F>({
        køn: null,
        ubestemt: "",
    });

    const onUpdate = (field: keyof T, value: string) => {
        const newFields = {
            ...fields,
            [field]: value,
        };
        setFields(newFields);

        const køn = newFields.køn;
        const ubestemt = newFields.ubestemt.trim();

        if (køn && ubestemt) {
            props.onAttempt({køn, ubestemt});
        } else {
            return props.onAttempt(undefined);
        }
    };

    const idPrefix = useRef(`id-${new Date().getTime()}`);

    const addInput = (field: keyof T, autoFocus=false) => (
        <>
            <label htmlFor={`${idPrefix.current}-${field}`}>
                {t(`question.substantiv.given_english.${field}.label`)}
            </label>
            <input
                id={`${idPrefix.current}-${field}`}
                value={fields[field] || ''}
                autoFocus={autoFocus}
                onChange={e => onUpdate(field, e.target.value)}
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
                {t('question.substantiv.given_english.gender.label')}
            </label>
            <GenderInput
                id={`${idPrefix.current}-køn`}
                value={fields.køn}
                onChange={v => onUpdate('køn', v || "")}
                autoFocus={true}
                data-testid="køn"
            />
            {addInput("ubestemt")}
        </div>
    );
}

export default Form;
