import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Bøjning from "../../../shared/bøjning";
import TextTidier from '../../../shared/text_tidier';

class AddVerbum extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.firstInputRef = React.createRef();
    }

    initialState() {
        const s = {
            infinitiv: '',
            bøjning: '',
            nutid: '',
            datid: '',
            førnutid: '',
            engelsk: '',
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state) {
        const tidyLowerCase = (s) => TextTidier.normaliseWhitespace(s).toLowerCase();

        const item = {
            type: 'verbum',
            infinitiv: 'at ' + tidyLowerCase(state.infinitiv).replace(/^at /, ''),
            nutid: [tidyLowerCase(state.nutid)],
            datid: [tidyLowerCase(state.datid)],
            førnutid: [tidyLowerCase(state.førnutid)],
        };

        if (!(item.infinitiv.match(/^at [a-zæøå]+$/))) return;
        if (!(item.nutid[0].match(/^[a-zæøå]+$/))) return;
        if (!(item.datid[0].match(/^[a-zæøå]+$/))) return;
        if (!(item.førnutid[0].match(/^[a-zæøå]+$/))) return;

        // no toLowerCase
        let engelsk = TextTidier.normaliseWhitespace(state.engelsk);
        if (engelsk !== '') {
          if (!(engelsk.startsWith('to '))) engelsk = 'to ' + engelsk;
          item.engelsk = engelsk;
        }

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

        const infinitiv = TextTidier.normaliseWhitespace(this.state.infinitiv)
          .toLowerCase().replace(/^at /, '');

        const bøjning = e.target.value.toLowerCase();
        newState.bøjning = bøjning;

        const result = new Bøjning().expandVerbum(infinitiv, bøjning.trim());
        if (result) {
          Object.keys(result).map(k => newState[k] = result[k]);
          newState.itemToSave = this.itemToSave(newState);
        }

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
                                    onChange={(e) => this.handleChange(e, 'infinitiv')}
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

AddVerbum.propTypes = {
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddVerbum;
