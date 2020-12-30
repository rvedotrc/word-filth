import * as React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";
import * as Gender from "lib/gender";

export type Props = {
    autoFocus: boolean;
    "data-testid": string;
    onChange: (value: Gender.Type | null) => void;
    value: string | null;
    inputRef?: React.RefObject<HTMLSelectElement>;
    id?: string;
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
        if (Gender.values.indexOf(e.target.value as Gender.Type) >= 0) {
            this.props.onChange(e.target.value as Gender.Type);
        } else {
            this.props.onChange(null);
        }
    }

    private onKeyDown(e: React.KeyboardEvent<HTMLSelectElement>) {
        if (e.key?.toLocaleLowerCase() === 'n') {
            this.props.onChange('en');
            e.stopPropagation();
        }
        if (e.key?.toLocaleLowerCase() === 't') {
            this.props.onChange('et');
            e.stopPropagation();
        }
    }

    render() {
        const { t } = this.props;

        const canAutoFocus = (
            window.navigator.userAgent.match(/\biPad\b/i) === null
        );

        return (
            <select
                onChange={e => this.onChange(e)}
                onKeyDown={e => this.onKeyDown(e)}
                value={this.props.value || ''}
                autoFocus={canAutoFocus && this.props.autoFocus}
                data-testid={this.props['data-testid']}
                id={this.props.id}
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
