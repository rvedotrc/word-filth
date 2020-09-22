import * as React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";

type Props = {
    autoFocus: boolean;
    "data-testid": string;
    onChange: (value: string) => void;
    allowedValues: string[];
    value: string;
    inputRef?: React.RefObject<HTMLSelectElement>;
} & WithTranslation

const LanguageInput = (props: Props) => {
    const { t } = props;

    let value = props.value;
    if (props.allowedValues.indexOf(value) < 0) {
        value = props.allowedValues[0];
    }

    return (
        <select
            onChange={e => props.onChange(e.target.value)}
            value={value}
            autoFocus={props.autoFocus}
            data-testid={props['data-testid']}
            ref={props.inputRef}
        >
            {props.allowedValues.map(lang => (
                <option
                    key={lang}
                    value={lang}
                >
                    {t('settings.language.' + lang)}
                </option>
            ))}
        </select>
    );
};

export default withTranslation()(LanguageInput);
