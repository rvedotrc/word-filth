import * as React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";

interface Props extends WithTranslation {
    autoFocus: boolean;
    "data-test-id": string;
    onChange: (value: string) => void;
    allowedValues: string[];
    value: string;
    inputRef?: any; // FIXME-any
}

interface State {
    value: string;
}

class LanguageInput extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let lang = props.value;
        if (props.allowedValues.indexOf(lang) < 0) {
            lang = props.allowedValues[0];
        }

        this.state = { value: lang };
    }

    onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        let v = e.target.value;
        this.props.onChange(v);
    }

    render() {
        const { t } = this.props;

        return (
            <select
                onChange={e => this.onChange(e)}
                value={this.state.value}
                autoFocus={this.props.autoFocus}
                data-test-id={this.props['data-test-id']}
                ref={this.props.inputRef}
            >
                {this.props.allowedValues.map(lang => (
                    <option
                        key={lang}
                        value={lang}
                    >
                        {t('settings.language.' + lang)}
                    </option>
                ))}
            </select>
        )
    }

}

export default withTranslation()(LanguageInput);
