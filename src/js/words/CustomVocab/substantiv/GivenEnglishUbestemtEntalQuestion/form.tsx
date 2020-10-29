import * as React from 'react';
import {useState} from 'react';
import {T} from ".";
import {QuestionFormProps} from "../../types";
import GenderInput from "@components/shared/gender_input";

const Form = (props: QuestionFormProps<T>) => {
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
        <div>
            <label>
                <span>{t('question.shared.label.danish')}</span>
                <GenderInput
                    value={fields.køn}
                    onChange={v => onUpdate('køn', v || "")}
                    autoFocus={true}
                    data-testid="køn"
                />
            </label>
            <input
                value={fields.ubestemtEntal || ''}
                onChange={e => onUpdate('ubestemtEntal', e.target.value)}
            />
        </div>
    );
}

export default Form;