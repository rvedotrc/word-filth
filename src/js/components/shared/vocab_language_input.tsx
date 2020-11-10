import * as React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";

import * as VocabLanguage from "lib/vocab_language";

type Props = {
    autoFocus: boolean;
    "data-testid": string;
    onChange: (value: VocabLanguage.Type) => void;
    value: VocabLanguage.Type;
    inputRef?: React.RefObject<HTMLSelectElement>;
} & WithTranslation

const VocabLanguageInput = (props: Props) => {
    const { t } = props;

    let value = props.value;
    if (VocabLanguage.values.indexOf(value) < 0) {
        value = VocabLanguage.defaultValue;
    }

    return (
        <select
            onChange={e => props.onChange(e.target.value as VocabLanguage.Type)}
            value={value}
            autoFocus={props.autoFocus}
            data-testid={props['data-testid']}
            ref={props.inputRef}
        >
            {VocabLanguage.values.map(lang => (
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

export default withTranslation()(VocabLanguageInput);
