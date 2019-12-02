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

    render() {
        if (!this.state) return null;
        const { vocab, addType } = this.state;
        if (!vocab) return null;

        return (
            <div style={{margin: '2em'}}>
                <h2>Mit Ordforråd</h2>

                <ShowList vocab={vocab}/>
            </div>
        )
    }
}

MyVocab.propTypes = {
    user: PropTypes.object.isRequired
};

export default MyVocab;
