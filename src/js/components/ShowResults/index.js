import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Questions from '../../Questions';
import ShowResultsRow from './row';

class ShowResults extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}`);
        ref.on('value', snapshot => this.setState({ db: snapshot.val() || {} }));
        this.setState({ ref: ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    render() {
        if (!this.state) return null;

        const { db } = this.state;
        if (!db) return null;

        const { t } = this.props;

        const questionsAndResults = new Questions(db).getQuestionsAndResults()
            .sort((a, b) => a.question.resultsLabel.localeCompare(b.question.resultsLabel));

        const atLevel = {};
        questionsAndResults.map(qr => {
            const level = qr.result.level;
            atLevel[level] = (atLevel[level] || 0) + 1;
        });

        return (
            <div>
                <h1>{t('show_results.heading')}</h1>
                <p>{t('show_results.level_count')} {
                    [0,1,2,3,4,5,6,7,8,9].map(level => `${level}:${atLevel[level] || 0}`).join(' / ')
                }</p>
                <table>
                    <thead>
                        <tr>
                            <th>{t('show_results.table.heading.key')}</th>
                            <th>{t('show_results.table.heading.level')}</th>
                            <th>{t('show_results.table.heading.try_again_after')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionsAndResults.map(qr => (
                            <ShowResultsRow
                                question={qr.question}
                                result={qr.result}
                                key={qr.question.resultsKey}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

ShowResults.propTypes = {
    user: PropTypes.object.isRequired
};

export default withTranslation()(ShowResults);
