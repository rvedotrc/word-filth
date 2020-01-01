import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Bøjning from "../../../shared/bøjning";
import TextTidier from '../../../shared/text_tidier';

class AddAdjektiv extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.firstInputRef = React.createRef();
    }

    initialState() {
        const s = {
            grundForm: '',
            bøjning: '',
            tForm: '',
            langForm: '',
            komparativ: '',
            superlativ: '',
            engelsk: '',
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state) {
        if (!(
            state.grundForm !== ''
            && state.tForm !== ''
            && state.langForm !== ''
            && ((state.komparativ === '') === (state.superlativ === ''))
        )) return null;

        const tidyLowerCase = (s) => TextTidier.normaliseWhitespace(state.grundForm).toLowerCase();

        const item = {
            type: 'adjektiv',
            grundForm: tidyLowerCase(state.grundForm),
            tForm: tidyLowerCase(state.tForm),
            langForm: tidyLowerCase(state.langForm),
        };

        if (state.komparativ.trim() !== '') {
            item.komparativ = tidyLowerCase(state.komparativ);
            item.superlativ = tidyLowerCase(state.superlativ);
        }

        // no toLowerCase
        let tmp = TextTidier.normaliseWhitespace(state.engelsk);
        if (tmp !== '') item.engelsk = tmp;

        return item;
    }

    handleChange(e, field) {
        const newState = this.state;
        newState[field] = e.target.value;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    handleBøjning(e) {
        const newState = this.state;

        const bøjning = e.target.value.toLowerCase(); // no trim
        newState.bøjning = bøjning;

        const result = new Bøjning().expandAdjektiv(
            TextTidier.normaliseWhitespace(this.state.grundForm),
            TextTidier.normaliseWhitespace(bøjning),
        );

        if (result) {
            Object.keys(result).map(k => newState[k] = result[k]);
        }

        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    onSubmit() {
        const { itemToSave } = this.state;
        if (!itemToSave) return;

        const newRef = this.props.dbref.push();
        newRef.set(itemToSave).then(() => {
            this.setState(this.initialState());
            this.firstInputRef.current.focus();
        });
    }

    render() {
        // TODO: t
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
                    Bøjningen bliver ikke gemte; den er kun noget, der
                    kan hjælpe dig at tilføje formerne. Brug fx "-t, -e" hvis du
                    vil have de t- og lang former, eller fx "-t, -e -mere, -mest"
                    hvis du også vil have komparativet og superlativet.
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
                                    ref={this.firstInputRef}
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
                                <i> fx '-t, -e'</i>
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
                                    size="30"
                                    value={this.state.engelsk}
                                    onChange={(e) => this.handleChange(e, 'engelsk')}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    <input type="submit" value="Tilføj" disabled={!this.state.itemToSave}/>
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

export default withTranslation()(AddAdjektiv);
