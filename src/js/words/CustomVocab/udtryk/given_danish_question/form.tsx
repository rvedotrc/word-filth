import * as React from 'react';
import {useState} from 'react';
import {T} from "./given_danish_question";
import {QuestionFormProps} from "../../types";

const Form = (props: QuestionFormProps<T>) => {
    const [value, setValue] = useState<string>("");

    return (
        <div>
            <label>
                <span>English:</span>
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
                />
            </label>
        </div>
    );
}

export default Form;
