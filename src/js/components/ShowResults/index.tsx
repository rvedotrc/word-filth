import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import * as ReactModal from 'react-modal';

declare const firebase: typeof import('firebase');

import Questions from '../../Questions';
import ShowResultsRow from './row';
import TestDriveQuestion from "./test_drive_question";
import CountsByLevel from "./counts_by_level";
import {Question} from "../../words/CustomVocab/types";
import DataSnapshot = firebase.database.DataSnapshot;

interface Props extends WithTranslation {
    user: firebase.User;
}

interface State {
    minLevel: number;
    maxLevel: number;
    db?: any; // FIXME-any
    ref?: firebase.database.Reference;
    listener?: (snapshot: DataSnapshot) => void;
    modalQuestion?: Question | undefined;
    showDebug?: boolean;
}

class ShowResults extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            minLevel: 0,
            maxLevel: 9,
        };
    }

    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}`);
        const listener = (snapshot: DataSnapshot) => this.setState({ db: snapshot.val() || {} });
        this.setState({ ref, listener });
        ref.on('value', listener);
    }

    componentWillUnmount() {
        this.state?.ref?.off('value', this.state.listener);
    }

    onChangeLimit(newValue: string, field: string) {
        const value = newValue.match('^[0-9]+$') ? 1 * Number.parseInt(newValue) : null;
        const s: any = {}; // FIXME-any
        s[field] = value;
        this.setState(s);
    }

    openModal(question: Question) {
        this.setState({ modalQuestion: question });
    }

    closeModal() {
        this.setState({ modalQuestion: undefined });
    }

    render() {
        if (!this.state) return null;

        const { db, minLevel, maxLevel } = this.state;
        if (!db) return null;

        const { t } = this.props;

        const questionsAndResults = new Questions(db).getQuestionsAndResults(true)
            .sort((a, b) => a.question.sortKey.localeCompare(b.question.sortKey));

        const atLevel = new Map<number, number>();
        questionsAndResults.map(qr => {
            const level = qr.result.level;
            atLevel.set(level, (atLevel.get(level) || 0) + 1);
        });

        const filteredList = questionsAndResults.filter(qr => (
            (minLevel === null || qr.result.level >= minLevel)
            &&
            (maxLevel === null || qr.result.level <= maxLevel)
        ));

        const canShowDebug = (window.location.hostname === 'localhost');
        const showDebug = !!this.state.showDebug;

        return (
            <div>
                <h1>{t('show_results.heading')}</h1>

                <CountsByLevel atLevel={atLevel}/>

                <p>
                    {t('show_results.level_filter', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        from: <input
                            type="text"
                            maxLength={1}
                            size={3}
                            value={minLevel === null ? '' : minLevel}
                            onChange={e => this.onChangeLimit(e.target.value, 'minLevel')}
                        />,
                        to: <input
                            type="text"
                            maxLength={1}
                            size={3}
                            value={maxLevel === null ? '' : maxLevel}
                            onChange={e => this.onChangeLimit(e.target.value, 'maxLevel')}
                        />
                    })}
                </p>

                {canShowDebug && <p>
                    <label>
                        <input
                            type="checkbox"
                            checked={showDebug}
                            onChange={() => this.setState({ showDebug: !showDebug })}
                        />
                        Show debug
                    </label>
                </p>}

                {this.state.modalQuestion && <div>
                    <ReactModal
                        isOpen={true}
                        contentLabel={"Test"}
                        appElement={document.getElementById("react_container") || undefined}
                    >
                        <TestDriveQuestion
                            question={this.state.modalQuestion}
                            onClose={() => this.closeModal()}
                        />
                    </ReactModal>
                </div>}

                <table>
                    <thead>
                        <tr>
                            {showDebug && <th>Debug</th>}
                            {showDebug && <th>Q</th>}
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
                                showDebug={showDebug}
                                openModal={q => this.openModal(q)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default withTranslation()(ShowResults);
