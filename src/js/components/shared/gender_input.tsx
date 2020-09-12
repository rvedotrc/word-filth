import * as React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";

export type Props = {
    autoFocus: boolean;
    "data-testid": string;
    onChange: (value: string | null) => void;
    value: string | null;
    inputRef?: React.RefObject<HTMLSelectElement>;
} & WithTranslation

export type State = {
    value: string | null;
}

class GenderInput extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        switch (props.value) {
            case 'en':
            case 'et':
            case 'pluralis':
                this.state = {
                    value: this.props.value,
                };
                break;
            default:
                this.state = {
                    value: null,
                };
        }
    }

    private onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        let v: string | null = e.target.value;
        if (v === '') v = null;
        this.props.onChange(v);
    }

    render() {
        const { t } = this.props;

        return (
            <select
                onChange={e => this.onChange(e)}
                value={this.props.value || ''}
                autoFocus={this.props.autoFocus}
                data-testid={this.props['data-testid']}
                ref={this.props.inputRef}
            >
                <option value=''>{t('shared.gender_input.choose')}</option>
                <option value='en'>en</option>
                <option value='et'>et</option>
                <option value='pluralis'>pluralis</option>
            </select>
        )
    }
}

export default withTranslation()(GenderInput);
