import React, { Component } from "react";
import PropTypes from "prop-types";

import Adder from './adder';
import MyVocab from '.';
import ShowList from './show_list';

class MyVocabPage extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/vocab`);
        ref.on('value', snapshot => this.setState({ vocab: snapshot.val() || [] }));
        this.setState({ ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    startAdd() {
        this.setState({
            isAdding: true,
            isDeleting: false
        });
    }

    startDelete() {
        this.setState({
            isAdding: false,
            isDeleting: true,
            selectedKeys: {},
        });
    }

    cancelAdd() {
        this.setState({ isAdding: false });
    }

    cancelDelete() {
        this.setState({ isDeleting: false });
    }

    toggleSelected(vocabKey) {
        const selectedKeys= new Object(this.state.selectedKeys);
        selectedKeys[vocabKey] = !selectedKeys[vocabKey];
        this.setState({ selectedKeys });
    }

    doDelete() {
        const selectedKeys = Object.keys(this.state.selectedKeys).filter(vocabKey => this.state.selectedKeys[vocabKey]);

        const message = (
            (selectedKeys.length === 1)
                ? 'Er du sikker på, at den vælgte item skal slettes?'
                : `Er du sikker på, at de vælgte ${selectedKeys.length} items skal slettes?`
        );

        if (window.confirm(message)) {
            // TODO: also delete any question-results for this item
            const promises = selectedKeys.map(vocabKey => this.state.ref.child(vocabKey).remove());
            Promise.all(promises).then(() => {
                this.setState({ isDeleting: false });
            });
        }
    }

    render() {
        if (!this.state) return null;
        const { vocab, isAdding, isDeleting } = this.state;
        if (!vocab) return null;

        const vocabList = new MyVocab({ vocab }).getAll();

        const selectedKeys = this.state.selectedKeys || {};
        const anySelected = Object.keys(selectedKeys).some(key => selectedKeys[key]);

        return (
            <div>
                <h2>Dit Ordforråd</h2>

                {!isAdding && !isDeleting && (
                    <p>
                        <input type="button" onClick={() => this.startAdd()} value="Tilføj ..."/>
                        <input type="button" onClick={() => this.startDelete()} value="Slet ..."/>
                    </p>
                )}
                {isAdding && (
                    <div>
                        <p>
                            <input type="button" onClick={() => this.cancelAdd()} value="Cancel"/>
                        </p>
                        <Adder dbref={this.state.ref}/>
                        <hr/>
                    </div>
                )}
                {isDeleting && (
                    <p>
                        <input type="button" onClick={() => this.doDelete()} disabled={!anySelected} value="Slet"/>
                        <input type="button" onClick={() => this.cancelDelete()} value="Cancel"/>
                    </p>
                )}

                <ShowList
                    vocabList={vocabList}
                    isDeleting={!!isDeleting}
                    selectedKeys={this.state.selectedKeys || {}}
                    onToggleSelected={(key) => this.toggleSelected(key)}
                />
            </div>
        )
    }
}

MyVocabPage.propTypes = {
    user: PropTypes.object.isRequired
};

export default MyVocabPage;
