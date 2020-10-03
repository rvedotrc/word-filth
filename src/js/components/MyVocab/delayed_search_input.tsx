import {useState} from "react";
import * as React from "react";

type Props = {
    defaultValue: string;
    delayMillis: number;
    onChange: (value: string) => void;
    autoFocus: boolean;
}

const DelayedSearchInput = (props: Props) => {
    const [lastSentValue, setLastSentValue] = useState<string>(props.defaultValue);
    const [timer, setTimer] = useState<number>();

    const onChange = (value: string) => {
        if (timer) window.clearTimeout(timer);

        setTimer(
            window.setTimeout(() => {
                if (lastSentValue !== value) {
                    props.onChange(value);
                    setLastSentValue(value);
                }
            }, props.delayMillis)
        );
    };

    return (
        <input
            type={"text"}
            defaultValue={props.defaultValue}
            autoFocus={props.autoFocus}
            onChange={evt => onChange(evt.target.value)}
        />
    );
};

export default DelayedSearchInput;
