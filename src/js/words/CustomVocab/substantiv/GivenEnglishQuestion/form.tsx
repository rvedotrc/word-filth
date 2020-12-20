import * as React from 'react';
import {useState} from 'react';
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
                value={fields.ubestemt || ''}
                onChange={e => onUpdate('ubestemt', e.target.value)}
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
