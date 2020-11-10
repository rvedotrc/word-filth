import * as React from 'react';
import {useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "lib/types/question";
import GenderInput from "@components/shared/gender_input";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./form.css");

const Form = (vocabLang: string) => (props: QuestionFormProps<T>) => {
    const {t} = props;

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

    return (
        <div className={styles.inputRow}>
            <label>
                <span>{t(`question.shared.label.${props.lang}`)}</span>
                <GenderInput
                    value={fields.køn}
                    onChange={v => onUpdate('køn', v || "")}
                    autoFocus={true}
                    data-testid="køn"
                />
            </label>
            <input
                type={"text"}
                value={fields.ubestemtEntal || ''}
                onChange={e => onUpdate('ubestemtEntal', e.target.value)}
                spellCheck={"false"}
                autoCapitalize={'none'}
                autoComplete={'off'}
                autoCorrect={'off'}
                lang={vocabLang}
            />
        </div>
    );
}

export default Form;
