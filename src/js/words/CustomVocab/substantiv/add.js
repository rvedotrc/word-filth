import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Bøjning from "../../../shared/bøjning";
import TextTidier from '../../../shared/text_tidier';

class AddNoun extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.firstInputRef = React.createRef();
        this.ubestemtEntalInputRef = React.createRef();
    }

    initialState() {
        const s = {
            køn: '',
            ubestemtEntal: '',
            bøjning: '',
            ubestemtFlertal: '',
            bestemtEntal: '',
            bestemtFlertal: '',
            engelsk: '',
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state) {
        const tidyLowerCase = (s) => TextTidier.normaliseWhitespace(s).toLowerCase();

        const item = {
            type: 'substantiv',
            køn: state.køn,
        };

        if (item.køn !== 'en' && item.køn !== 'et' && item.køn !== 'pluralis') return;

        let hasForm = false;
        ['ubestemtEntal', 'bestemtEntal', 'ubestemtFlertal', 'bestemtFlertal'].map(key => {
            const t = tidyLowerCase(state[key]);
            if (t !== '') {
                item[key] = t;
                hasForm = true;
            }
        });
        if (!hasForm) return;

        const t = TextTidier.normaliseWhitespace(state.engelsk);
        item.engelsk = t;
        if (item.engelsk === '') return;

        return item;
    }

    handleKøn(e) {
        const value = e.target.value.trim().toLowerCase();

        const newState = new Object(this.state);

        if (value.match(/^(en|n|f|fælleskøn)$/)) {
            newState.køn = 'en';
            this.ubestemtEntalInputRef.current.focus();
        }
        else if (value.match(/^(et|t|i|intetkøn)$/)) {
            newState.køn = 'et';
            this.ubestemtEntalInputRef.current.focus();
        }
        else if (value.match(/^(p|pluralis)$/)) {
            newState.køn = 'pluralis';
            this.ubestemtEntalInputRef.current.focus();
        }
        else if (value === 'e') {
            newState.køn = 'e';
        } else {
            newState.køn = '';
        }

        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    handleChange(e, field) {
        const newState = this.state;
        newState[field] = e.target.value;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    handleBøjning(e) {
        // FIXME: are there cases where we're modifying this.state in place?
        const { ubestemtEntal } = this.state;
        const bøjning = e.target.value.toLowerCase();
        this.setState({ bøjning });

        const result = new Bøjning().expandSubstantiv(ubestemtEntal, bøjning);
        if (result) this.setState(result);
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
                                    size="10"
                                    value={this.state.køn}
                                    onChange={(e) => this.handleKøn(e)}
                                    autoFocus="yes"
                                    ref={this.firstInputRef}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (ubestemt ental form):</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.ubestemtEntal}
                                    onChange={(e) => this.handleChange(e, 'ubestemtEntal')}
                                    ref={this.ubestemtEntalInputRef}
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
                                <i> fx '-en, -er, -erne'</i>
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (bestemt ental form):</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bestemtEntal}
                                    onChange={(e) => this.handleChange(e, 'bestemtEntal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (ubestemt flertal form):</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.ubestemtFlertal}
                                    onChange={(e) => this.handleChange(e, 'ubestemtFlertal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (bestemt flertal form):</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bestemtFlertal}
                                    onChange={(e) => this.handleChange(e, 'bestemtFlertal')}
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

AddNoun.propTypes = {
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddNoun;
