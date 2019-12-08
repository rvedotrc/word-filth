import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AddAdjektiv extends Component {
    constructor(props) {
        super(props);

        this.state = {
            grundForm: '',
            tForm: '',
            langForm: '',
            komparativ: '',
            superlativ: '',
            engelsk: '',
            submitDisabled: true
        };
    }

    handleChange(e, field) {
        const newState = this.state;

        newState[field] = e.target.value.trim().toLowerCase();

        newState.submitDisabled = !this.canSubmit(newState);
        this.setState(newState);
    }

    canSubmit(state) {
        return (
            state.grundForm !== ''
            && state.tForm !== ''
            && state.langForm !== ''
            && ((state.komparativ === '') === (state.superlativ === ''))
        );
    }

    onSubmit() {
        if (this.state.submitDisabled) return;

        let { grundForm, tForm, langForm, komparativ, superlativ, engelsk } = this.state;

        var newRef = this.props.dbref.push();
        newRef.set({
            type: 'adjektiv',
            grundForm,
            tForm,
            langForm,
            komparativ,
            superlativ,
            engelsk
        }).then(() => {
            this.setState({
                grundForm: '',
                tForm: '',
                langForm: '',
                komparativ: '',
                superlativ: '',
                engelsk: '',
                submitDisabled: true
            });
        });
    }

    render() {
        const { submitDisabled } = this.state;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onSubmit(); }}
                onReset={this.props.onCancel}
            >
                <p>
                    Indtast de grund, t- og lang former.
                </p>
                <p>
                    Komparativet og superlativet må også gerne udfyldes,
                    eller må blive tomme (så "mest" og "mere" plus grundformen
                    antages).
                </p>
                <p>
                    Det engelske er frivilligt.
                </p>

                <table>
                    <tbody>
                        <tr>
                            <td>Grund form:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.grundForm}
                                    onChange={(e) => this.handleChange(e, 'grundForm')}
                                    autoFocus="yes"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>t form:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.tForm}
                                    onChange={(e) => this.handleChange(e, 'tForm')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Lang form:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.langForm}
                                    onChange={(e) => this.handleChange(e, 'langForm')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Komparativ:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.komparativ}
                                    onChange={(e) => this.handleChange(e, 'komparativ')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Superlativ:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.superlativ}
                                    onChange={(e) => this.handleChange(e, 'superlativ')}
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
                                    value={this.state.engelsk}
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

AddAdjektiv.propTypes = {
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddAdjektiv;
