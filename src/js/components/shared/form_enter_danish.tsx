import * as React from 'react';
import {useRef, useState} from 'react';
import {QuestionFormProps} from "lib/types/question";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./form_enter_x.css");

export type T = {
    dansk: string;
}

const FormEnterDanish = (props: QuestionFormProps<T>) => {
    const [value, setValue] = useState<string>("");

    const idPrefix = useRef(`id-${new Date().getTime()}`);

    return (
        <div className={styles.grid}>
            <label htmlFor={idPrefix.current}>{props.t(`question.shared.label.${props.lang}`)}</label>
            <input
                id={idPrefix.current}
                value={value}
                autoFocus={true}
                onChange={e => {
                    let newValue = e.target.value;
                    setValue(newValue);
                    newValue = newValue.trim();

                    if (newValue !== '') {
                        props.onAttempt({ dansk: newValue });
                    } else {
                        props.onAttempt(undefined);
                    }
                }}
                spellCheck={"false"}
                autoCapitalize={'none'}
                autoComplete={'off'}
                autoCorrect={'off'}
                lang={props.lang}
            />
        </div>
    );
}

export default FormEnterDanish;
