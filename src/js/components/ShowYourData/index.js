import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import styles from './index.css';

class ShowYourData extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}`);
        ref.on('value', snapshot => this.setState({ data: snapshot.val() || {} }));
        this.setState({ ref: ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    onSubmit(e) {
        e.preventDefault();
        const data = JSON.parse(e.target[0].value);

        if (window.confirm('Er du sikker på, at du vil opdatere dit data?')) {
            this.state.ref.set(data).then(() => {
                window.alert('Data opdaterede');
            });
        }
    }

    render() {
        if (!this.state) return null;
        const { data } = this.state;
        if (!data) return null;

        return (
            <div>
                <h1>Dit Data</h1>

                <p>
                    Her kan ses dit data. Du må gerne redigere det,
                    hvis du vil, men det kan selvfølgelig give årsag til
                    fejl, hvis formen ikke er rigtig.
                </p>

                <p>
                    Du må også slette dit data, ved at replacere
                    det med <span className={styles.code}>{'{}'}</span>.
                </p>

                <form onSubmit={(e) => this.onSubmit(e)}>
                    <textarea
                        name="data"
                        cols="70"
                        rows="20"
                        defaultValue={JSON.stringify(data, null, 2)}
                    />

                    <p>
                        <input type="submit" value="Opdater"/>
                    </p>
                </form>
            </div>
        )
    }
}

ShowYourData.propTypes = {
    user: PropTypes.object.isRequired
};

export default ShowYourData;
