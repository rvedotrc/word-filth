import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextTidier from '../../../shared/text_tidier';

class AddPhrase extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.firstInputRef = React.createRef();
    }

    initialState() {
        const s = {
            dansk: '',
            engelsk: '',
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state) {
        // no toLowerCase
        const dansk = TextTidier.normaliseWhitespace(state.dansk);
        const engelsk = TextTidier.normaliseWhitespace(state.engelsk);
        if (!(
            dansk !== ''
            && engelsk !== ''
        )) return null;

        const item = {
            type: 'udtryk',
            dansk,
            engelsk,
        };

        return item;
    }

    handleChange(e, field) {
        const newState = this.state;
        newState[field] = e.target.value;
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
                                    size="30"
                                    value={this.state.dansk}
                                    onChange={(e) => this.handleChange(e, 'dansk')}
                                    autoFocus="yes"
                                    ref={this.firstInputRef}
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

AddPhrase.propTypes = {
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddPhrase;
