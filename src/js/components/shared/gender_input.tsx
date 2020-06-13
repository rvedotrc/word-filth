import * as React from 'react';

export type Props = {
    autoFocus: boolean;
    "data-testid": string;
    onChange: (value: string | null) => void;
    value: string | null;
    inputRef?: React.RefObject<HTMLSelectElement>;
}

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

    onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        let v: string | null = e.target.value;
        if (v === '') v = null;
        this.props.onChange(v);
    }

    render() {
        // TODO: i18n for [vælg]

        return (
            <select
                onChange={e => this.onChange(e)}
                value={this.props.value || ''}
                autoFocus={this.props.autoFocus}
                data-testid={this.props['data-testid']}
                ref={this.props.inputRef}
            >
                <option value=''>[vælg et køn]</option>
                <option value='en'>en</option>
                <option value='et'>et</option>
                <option value='pluralis'>pluralis</option>
            </select>
        )
    }
}

export default GenderInput;
