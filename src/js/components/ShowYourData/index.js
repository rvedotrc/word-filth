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
        const { t } = this.props;
        const data = JSON.parse(e.target[0].value);

        if (window.confirm(t('show_your_data.update_question'))) {
            this.state.ref.set(data).then(() => {
                window.alert(t('show_your_data.update_confirmation'));
            });
        }
    }

    render() {
        if (!this.state) return null;

        const { data } = this.state;
        if (!data) return null;

        const { t } = this.props;

        return (
            <div>
                <h1>{t('show_your_data.heading')}</h1>

                <p>{t('show_your_data.general_explanation')}</p>

                <p>
                    {t('show_your_data.delete_explanation', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        code: <span key="code" className={styles.code}>{'{}'}</span>,
                    })}
                </p>

                <form onSubmit={(e) => this.onSubmit(e)}>
                    <textarea
                        name="data"
                        cols="70"
                        rows="20"
                        defaultValue={JSON.stringify(data, null, 2)}
                    />

                    <p>
                        <input type="submit" value={t('show_your_data.button')}/>
                    </p>
                </form>
            </div>
        )
    }
}

ShowYourData.propTypes = {
    user: PropTypes.object.isRequired
};

export default withTranslation()(ShowYourData);
