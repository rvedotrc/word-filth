import * as React from 'react';

export interface Props {
    autoFocus: boolean;
    "data-test-id": string;
    onChange: (value: string) => void;
    value: string;
    inputRef?: React.RefObject<HTMLSelectElement>;
}

export interface State {
    value: string;
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

    onChange(e: any) { // FIXME-any
        let v = e.target.value;
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
                data-test-id={this.props['data-test-id']}
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
