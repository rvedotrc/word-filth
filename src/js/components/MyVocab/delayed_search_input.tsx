import {useEffect, useState} from "react";
import * as React from "react";

type Props = {
    onChange: (value: string) => void;
    autoFocus: boolean;
}

const DelayedSearchInput = (props: Props) => {
    const [value, setValue] = useState<string>("");

    useEffect(() => {
        const timer = window.setTimeout(() => props.onChange(value), 250);
        return () => window.clearTimeout(timer);
    });

    return (
        <input
            type={"text"}
            autoFocus={props.autoFocus}
            value={value}
            onChange={evt => setValue(evt.target.value)}
        />
    );
};

export default DelayedSearchInput;
