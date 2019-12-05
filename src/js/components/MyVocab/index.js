import React, { Component } from "react";
import PropTypes from "prop-types";

import ShowList from './show_list';

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

    startDelete() {
        this.setState({
            isDeleting: true,
            selectedKeys: {},
        });
    }

    cancelDelete() {
        this.setState({ isDeleting: false });
    }

    toggleSelected(key) {
        const selectedKeys= new Object(this.state.selectedKeys);
        selectedKeys[key] = !selectedKeys[key];
        this.setState({ selectedKeys });
    }

    doDelete() {
        const selectedKeys = Object.keys(this.state.selectedKeys).filter(key => this.state.selectedKeys[key]);

        const message = (
            (selectedKeys.length === 1)
                ? 'Er du sikker på, at den vælgte item skal slettes?'
                : `Er du sikker på, at de vælgte ${selectedKeys.length} items skal slettes?`
        );

        if (window.confirm(message)) {
            const promises = selectedKeys.map(key => this.state.ref.child(key).remove());
            Promise.all(promises).then(() => {
                this.setState({ isDeleting: false });
            });
        }
    }

    render() {
        if (!this.state) return null;
        const { vocab, isDeleting } = this.state;
        if (!vocab) return null;

        const selectedKeys = this.state.selectedKeys || {};
        const anySelected = Object.keys(selectedKeys).some(key => selectedKeys[key]);

        return (
            <div style={{margin: '2em'}}>
                <h2>Dit Ordforråd</h2>

                <form>
                    {!isDeleting && (
                        <p><input type="button" onClick={() => this.startDelete()} value="Slet ..."/></p>
                    )}
                    {isDeleting && (
                        <p>
                            <input type="button" onClick={() => this.doDelete()} disabled={!anySelected} value="Slet"/>
                            <input type="button" onClick={() => this.cancelDelete()} value="Cancel"/>
                        </p>
                    )}
                    <ShowList
                        vocab={vocab}
                        isDeleting={!!isDeleting}
                        selectedKeys={this.state.selectedKeys || {}}
                        onToggleSelected={(key) => this.toggleSelected(key)}
                    />
                </form>
            </div>
        )
    }
}

MyVocab.propTypes = {
    user: PropTypes.object.isRequired
};

export default MyVocab;
