import * as React from 'react';
import {useState} from 'react';
import GivenEnglishQuestion , {AT} from "./given_english_question";
import {QuestionFormProps} from "../../types";

const Form = (props: QuestionFormProps<AT, GivenEnglishQuestion>) => {
    const [value, setValue] = useState<string>("");

    return (
        <div>
            <label>
                <span>Danish:</span>
                <input
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
                />
            </label>
        </div>
    );
}

export default Form;
