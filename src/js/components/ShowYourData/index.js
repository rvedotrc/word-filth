import React, { Component } from "react";
import PropTypes from "prop-types";

class ShowYourData extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}`);
        ref.on('value', snapshot => this.setState({ data: snapshot.val() }));
        this.setState({ ref: ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    render() {
        if (!this.state) return null;
        const { data } = this.state;
        if (!data) return null;

        return (
            <div id="VerbList" className={'message'}>
                <h2>Din Data</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        )
    }
}

ShowYourData.propTypes = {
    user: PropTypes.object.isRequired
}

export default ShowYourData;
