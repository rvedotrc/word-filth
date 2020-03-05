import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GenderInput extends Component {

    constructor(props) {
        super(props);

        switch (props.initialValue) {
            case 'en':
            case 'et':
            case 'pluralis':
                this.state = {
                    value: this.props.initialValue,
                };
                break;
            default:
                this.state = {
                    value: null,
                };
        }
    }

    onChange(e) {
        let v = e.target.value;
        if (v === '') v = null;
        this.props.onChange(v);
    }

    render() {
        return (
            <select
                onChange={e => this.onChange(e)}
                defaultValue={this.props.initialValue}
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

GenderInput.propTypes = {
    autoFocus: PropTypes.string.isRequired,
    "data-test-id": PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
    inputRef: PropTypes.object,
};

export default GenderInput;
