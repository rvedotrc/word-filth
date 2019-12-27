import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Settings extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/settings`);
        ref.on('value', snapshot => this.setState({ data: snapshot.val() || {} }));
        this.setState({ ref: ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    toggle(name) {
        const newRef = this.state.ref.child(name);
        newRef.set(!this.state.data[name]);
    }

    render() {
        if (!this.state) return null;
        const { data } = this.state;
        if (!data) return null;

        return (
            <div>
                <h2>Indstillinger</h2>

                <p>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!data.deactivateBuiltinVerbs}
                            onChange={() => this.toggle('deactivateBuiltinVerbs')}
                        />
                        Deaktiver ingygget list af verber
                    </label>
                </p>

                <p>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!data.activateBabbel}
                            onChange={() => this.toggle('activateBabbel')}
                        />
                        Aktiver Babbel ordforråd list
                    </label>
                </p>
            </div>
        );
    }
}

Settings.propTypes = {
    user: PropTypes.object.isRequired
};

export default Settings;
