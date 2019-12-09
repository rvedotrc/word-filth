import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Bøjning from "../substantiv/bøjning";

class AddVerbum extends Component {
    constructor(props) {
        super(props);

        this.state = this.blankState();
    }

    blankState() {
        return {
            infinitiv: '',
            bøjning: '',
            nutid: '',
            datid: '',
            førnutid: '',
            engelsk: '',
            submitDisabled: true
        };
    }

    handleChange(e, field, trim) {
        if (trim === undefined) trim = true;
        const newState = this.state;

        newState[field] = e.target.value.toLowerCase();
        if (trim) newState[field] = newState[field].trim();

        newState.submitDisabled = !this.canSubmit(newState);
        this.setState(newState);
    }

    handleBøjning(e) {
        const infinitiv = this.state.infinitiv.replace(/^at /, '').toLowerCase();
        const bøjning = e.target.value.toLowerCase();
        this.setState({ bøjning });

        const result = new Bøjning().expandVerbum(infinitiv, bøjning.trim());
        if (result) this.setState(result);
    }

    canSubmit(state) {
        return (
            state.infinitiv !== ''
            && state.nutid !== ''
            && state.datid !== ''
            && state.førnutid !== ''
        );
    }

    onSubmit() {
        if (this.state.submitDisabled) return;

        let { infinitiv, nutid, datid, førnutid, engelsk } = this.state;

        if (infinitiv !== '' && !infinitiv.startsWith('at ')) {
            infinitiv = 'at ' + infinitiv;
        }

        if (engelsk !== '' && !engelsk.startsWith('to ')) {
            engelsk = 'to ' + engelsk;
        }

        const record = {
            type: 'verbum',
            infinitiv,
            nutid: [nutid],
            datid: [datid],
            førnutid: [førnutid],
        };

        if (engelsk != '') record.engelsk = engelsk;

        var newRef = this.props.dbref.push();
        newRef.set(record).then(() => {
            this.setState(this.blankState());
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
                    Indtast de nutid, datid, og førnutid former.
                </p>
                <p>
                    Bøjningen bliver ikke gemte; den er kun noget, der
                    kan hjælpe dig at tilføje formerne. Brug fx "-r, -de, -t"
                    for gruppe én.
                </p>
                <p>
                    Det engelske er frivilligt.
                </p>

                <table>
                    <tbody>
                        <tr>
                            <td>Infinitiv:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.infinitiv}
                                    onChange={(e) => this.handleChange(e, 'infinitiv', false)}
                                    autoFocus="yes"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Bøjning:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bøjning}
                                    onChange={(e) => this.handleBøjning(e)}
                                />
                                <i> fx '-r, -de, -t'</i>
                            </td>
                        </tr>
                        <tr>
                            <td>Nutid:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.nutid}
                                    onChange={(e) => this.handleChange(e, 'nutid')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Datid:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.datid}
                                    onChange={(e) => this.handleChange(e, 'datid')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Førnutid:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.førnutid}
                                    onChange={(e) => this.handleChange(e, 'førnutid')}
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
                                    onChange={(e) => this.handleChange(e, 'engelsk', false)}
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

AddVerbum.propTypes = {
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddVerbum;
