import * as React from 'react';
import {useState} from 'react';
import {QuestionFormProps} from "lib/types/question";

export type T = {
    engelsk: string;
}

const FormEnterEnglish = (props: QuestionFormProps<T>) => {
    const [value, setValue] = useState<string>("");

    return (
        <div>
            <label>
                <span>{props.t('question.shared.label.en')}</span>
                <input
                    value={value}
                    autoFocus={true}
                    onChange={e => {
                        let newValue = e.target.value;
                        setValue(newValue);
                        newValue = newValue.trim();

                        if (newValue !== '') {
                            props.onAttempt({ engelsk: newValue });
                        } else {
                            props.onAttempt(undefined);
                        }
                    }}
                    spellCheck={"false"}
                    autoCapitalize={'none'}
                    autoComplete={'off'}
                    autoCorrect={'off'}
                    lang={'en'}
                />
            </label>
        </div>
    );
}

export default FormEnterEnglish;
