import * as React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";

import * as UILanguage from "lib/ui_language";

type Props = {
    autoFocus: boolean;
    "data-testid": string;
    onChange: (value: UILanguage.Type) => void;
    value: UILanguage.Type;
    inputRef?: React.RefObject<HTMLSelectElement>;
} & WithTranslation

const UILanguageInput = (props: Props) => {
    const { t } = props;

    let value = props.value;
    if (UILanguage.values.indexOf(value) < 0) {
        value = UILanguage.defaultValue;
    }

    return (
        <select
            onChange={e => props.onChange(e.target.value as UILanguage.Type)}
            value={value}
            autoFocus={props.autoFocus}
            data-testid={props['data-testid']}
            ref={props.inputRef}
        >
            {UILanguage.values.map(lang => (
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

export default withTranslation()(UILanguageInput);
