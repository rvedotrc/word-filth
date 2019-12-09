import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AddPhrase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dansk: '',
            engelsk: '',
            submitDisabled: true
        };
    }

    handleChange(event, field) {
        const newState = this.state;

        newState[field] = event.target.value;

        const dansk = this.state.dansk.trim();
        const engelsk = this.state.engelsk.trim();
        newState.submitDisabled = (dansk === '' || engelsk === '');

        this.setState(newState);
    }

    onSubmit() {
        if (this.state.submitDisabled) return;

        const { dansk, engelsk } = this.state;

        const newRef = this.props.dbref.push();
        newRef.set({
            type: 'udtryk',
            dansk: dansk,
            engelsk: engelsk
        }).then(() => {
            this.setState({
                dansk: '',
                engelsk: '',
                submitDisabled: true
            });
        });
    }

    render() {
        const { dansk, engelsk, submitDisabled } = this.state;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onSubmit(); }}
                onReset={this.props.onCancel}
            >
                <p>
                    I Word Filth har et udtryk en dansk form, og en engelsk form.
                    Det er den frieste form af ordforråd.
                </p>

                <table>
                    <tbody>
                        <tr>
                            <td>Dansk:</td>
                            <td>
                                <input
                                    type="text"
                                    name="dansk"
                                    size="30"
                                    value={dansk}
                                    onChange={(e) => this.handleChange(e, 'dansk')}
                                    autoFocus="yes"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Engelsk:</td>
                            <td>
                                <input
                                    type="text"
                                    name="engelsk"
                                    size="30"
                                    value={engelsk}
                                    onChange={(e) => this.handleChange(e, 'engelsk')}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    <input type="submit" value="Tilføj" disabled={submitDisabled}/>
                    <input type="reset" value="Cancel"/>
                </p>
            </form>
        )
    }
}

AddPhrase.propTypes = {
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddPhrase;
