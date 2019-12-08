import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Bøjning from "./bøjning";

class AddNoun extends Component {
    constructor(props) {
        super(props);

        this.state = {
            køn: '',
            ubestemtEntal: '',
            bøjning: '',
            ubestemtFlertal: '',
            bestemtEntal: '',
            bestemtFlertal: '',
            engelsk: '',
            submitDisabled: true
        };
    }

    handleKøn(e) {
        const value = e.target.value.toLowerCase();

        const newState = this.state;

        if (value.trim().match(/^(en|n|f|fælleskøn)$/)) {
            newState.køn = 'en';
        }
        else if (value.trim().match(/^(et|t|i|intetkøn)$/)) {
            newState.køn = 'et';
        }
        else if (value.trim().match(/^(p|pluralis)$/)) {
            newState.køn = 'pluralis';
        }
        else if (value === 'e') {
            newState.køn = 'e';
        } else {
            newState.køn = '';
        }

        newState.submitDisabled = !this.canSubmit(newState);
        this.setState(newState);
    }

    handleChange(e, field) {
        const newState = this.state;

        newState[field] = e.target.value;

        newState.submitDisabled = !this.canSubmit(newState);
        this.setState(newState);
    }

    handleBøjning(e) {
        const { ubestemtEntal } = this.state;
        const bøjning = e.target.value.toLowerCase();
        this.setState({ bøjning });

        const result = new Bøjning().expand(ubestemtEntal, bøjning);
        if (result) this.setState(result);
    }

    canSubmit(state) {
        const {køn, ubestemtEntal, bestemtEntal, ubestemtFlertal, bestemtFlertal, engelsk} = state;

        const harKøn = (køn === 'en' || køn === 'et' || køn === 'pluralis');

        const harDansk = (
            ubestemtEntal !== '' ||
            bestemtEntal !== '' ||
            ubestemtFlertal !== '' ||
            bestemtFlertal !== ''
        );

        return (harKøn && harDansk && engelsk !== '');
    }

    onSubmit() {
        if (this.state.submitDisabled) return;

        const { køn, ubestemtEntal, bestemtEntal, ubestemtFlertal, bestemtFlertal, engelsk } = this.state;

        var newRef = this.props.dbref.push();
        newRef.set({
            type: 'substantiv',
            køn,
            ubestemtEntal,
            bestemtEntal,
            ubestemtFlertal,
            bestemtFlertal,
            engelsk
        }).then(() => {
            this.setState({
                køn: '',
                ubestemtEntal: '',
                bestemtEntal: '',
                ubestemtFlertal: '',
                bestemtFlertal: '',
                bøjning: '',
                engelsk: ''
            });
        });
    }

    render() {
        const { køn, ubestemtEntal, bøjning, bestemtEntal, ubestemtFlertal, bestemtFlertal, engelsk, submitDisabled } = this.state;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onSubmit(); }}
                onReset={this.props.onCancel}
            >
                <p>
                    I Word Filth har et substantiv et køn, mindst én form på dansk,
                    og en oversættelse på engelsk.
                    Bøjningen bliver ikke gemte; den er kun noget, der
                    kan hjælpe dig at tilføje formerne.
                </p>
                <p>
                    Kønnet kan indtastes med kun 'n', 't' eller 'p'.
                </p>

                <table>
                    <tbody>
                        <tr>
                            <td>Køn:</td>
                            <td>
                                <input
                                    type="text"
                                    name="køn"
                                    size="10"
                                    value={køn}
                                    onChange={(e) => this.handleKøn(e)}
                                    autoFocus="yes"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (ubestemt ental form):</td>
                            <td>
                                <input
                                    type="text"
                                    name="ubestemtEntal"
                                    size="30"
                                    value={ubestemtEntal}
                                    onChange={(e) => this.handleChange(e, 'ubestemtEntal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Bøjning:</td>
                            <td>
                                <input
                                    type="text"
                                    name="bøjning"
                                    size="30"
                                    value={bøjning}
                                    onChange={(e) => this.handleBøjning(e)}
                                />
                                <i> fx '-en, -er, -erne'</i>
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (bestemt ental form):</td>
                            <td>
                                <input
                                    type="text"
                                    name="bestemtEntal"
                                    size="30"
                                    value={bestemtEntal}
                                    onChange={(e) => this.handleChange(e, 'bestemtEntal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (ubestemt flertal form):</td>
                            <td>
                                <input
                                    type="text"
                                    name="ubestemtFlertal"
                                    size="30"
                                    value={ubestemtFlertal}
                                    onChange={(e) => this.handleChange(e, 'ubestemtFlertal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (bestemt flertal form):</td>
                            <td>
                                <input
                                    type="text"
                                    name="bestemtFlertal"
                                    size="30"
                                    value={bestemtFlertal}
                                    onChange={(e) => this.handleChange(e, 'bestemtFlertal')}
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

AddNoun.propTypes = {
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddNoun;
