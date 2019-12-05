import React, { Component } from "react";
import PropTypes from "prop-types";

import Adder from './adder';
import ShowList from './show_list';
import Udtryk from "./udtryk";
import Substantiv from "./substantiv";
import Default from "./default";

class MyVocabTest extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/vocab`);
        ref.on('value', snapshot => this.setState({ vocab: snapshot.val() || [] }));
        this.setState({ ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    instantiateAll() {
        const vocab = this.state.vocab;
        const handlers = {
            udtryk: Udtryk,
            substantiv: Substantiv,
            // verbum: Verbum,
        };

        return Object.keys(vocab)
            .map(dbKey => {
                const data = vocab[dbKey];
                const handler = handlers[data.type] || Default;
                return new handler(dbKey, data);
            });
    }

    getQuestions() {
        var q = [];
        this.instantiateAll().map(item => {
            q = q.concat(item.getQuestions());
        });
        return q;
    }

    render() {
        if (!this.state) return null;
        if (!this.state.vocab) return null;

        return (
            <pre>{JSON.stringify(this.getQuestions(), null, 2)}</pre>
        );
    }
}

MyVocabTest.propTypes = {
    user: PropTypes.object.isRequired
};

export default MyVocabTest;
