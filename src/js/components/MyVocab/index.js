import React, { Component } from "react";
import PropTypes from "prop-types";

import AddNoun from './add_noun.js';
import AddPhrase from './add_phrase.js';

class MyVocab extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/vocab`);
        ref.on('value', snapshot => this.setState({ vocab: snapshot.val() || [] }));
        this.setState({
            ref: ref,
            addType: 'udtryk'
        });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    onChange(e) {
        this.setState({ addType: e.currentTarget.value });
    }

    render() {
        if (!this.state) return null;
        const { vocab, addType } = this.state;
        if (!vocab) return null;

        const onChange = (e) => this.onChange(e);

        const types = [
            { key: 'udtryk', label: 'Udtryk', klass: AddPhrase },
            { key: 'substantiv', label: 'Substantiv', klass: AddNoun },
        ];

        types[types.length-1].last = true;

        const selectedType = types.filter(e => e.key === addType)[0];

        return (
            <div style={{margin: '2em'}}>
                <h2>Mit Ordforråd</h2>

                <h3>Tilføj</h3>
                <form>
                    <p>
                        {types.map(t => (
                            <span key={t.key}>
                                <input
                                    type="radio"
                                    name="type"
                                    onChange={onChange}
                                    value={t.key}
                                    checked={addType === t.key}
                                />
                                {" " + t.key}
                                {t.last || (
                                    <br/>
                                )}
                            </span>
                        ))}
                    </p>
                </form>

                {selectedType
                    && selectedType.klass
                    && React.createElement(selectedType.klass, { dbref: this.state.ref }, null)}

                {vocab && (
                    <div>
                        <h3>Rå data</h3>
                        <pre>{JSON.stringify(vocab, null, 2)}</pre>
                    </div>
                )}
            </div>
        )
    }
}

MyVocab.propTypes = {
    user: PropTypes.object.isRequired
};

export default MyVocab;
