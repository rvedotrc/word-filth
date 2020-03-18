import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Questions from '../../Questions';
import ShowResultsRow from './row';

class ShowResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minLevel: 0,
            maxLevel: 9,
        };
    }

    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}`);
        ref.on('value', snapshot => this.setState({ db: snapshot.val() || {} }));
        this.setState({ ref: ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    onChangeLimit(newValue, field) {
        const value = newValue.match('^[0-9]+$') ? 1 * newValue : null;
        const s = {};
        s[field] = value;
        this.setState(s);
    }

    render() {
        if (!this.state) return null;

        const { db, minLevel, maxLevel } = this.state;
        if (!db) return null;

        const { t } = this.props;

        const questionsAndResults = new Questions(db).getQuestionsAndResults()
            .sort((a, b) => a.question.resultsLabel.localeCompare(b.question.resultsLabel));

        const atLevel = {};
        questionsAndResults.map(qr => {
            const level = qr.result.level;
            atLevel[level] = (atLevel[level] || 0) + 1;
        });

        const filteredList = questionsAndResults.filter(qr => (
            (minLevel === null || qr.result.level >= minLevel)
            &&
            (maxLevel === null || qr.result.level <= maxLevel)
        ));

        return (
            <div>
                <h1>{t('show_results.heading')}</h1>
                <p>{t('show_results.level_count')} {
                    [0,1,2,3,4,5,6,7,8,9].map(level => `${level}:${atLevel[level] || 0}`).join(' / ')
                }</p>
                <p>
                    {t('show_results.level_filter', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        from: <input
                            key="from"
                            type="text"
                            maxLength={1}
                            size={3}
                            value={minLevel === null ? '' : minLevel}
                            onChange={e => this.onChangeLimit(e.target.value, 'minLevel')}
                        />,
                        to: <input
                            key="to"
                            type="text"
                            maxLength={1}
                            size={3}
                            value={maxLevel === null ? '' : maxLevel}
                            onChange={e => this.onChangeLimit(e.target.value, 'maxLevel')}
                        />
                    })}
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>{t('show_results.table.heading.key')}</th>
                            <th>{t('show_results.table.heading.answer')}</th>
                            <th>{t('show_results.table.heading.level')}</th>
                            <th>{t('show_results.table.heading.attempts')}</th>
                            <th>{t('show_results.table.heading.try_again_after')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.map(qr => (
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
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default withTranslation()(ShowResults);
