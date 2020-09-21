import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import * as ReactModal from 'react-modal';

declare const firebase: typeof import('firebase');

import ShowResultsRow from './row';
import TestDriveQuestion from "./test_drive_question";
import CountsByLevel from "./counts_by_level";
import {Question} from "../../words/CustomVocab/types";
import {CallbackRemover} from "lib/observer";
import {currentQuestionsAndResults} from "lib/app_context";
import {QuestionAndResult} from "../../Questions/types";

type Props = {
    user: firebase.User;
} & WithTranslation

type State = {
    minLevel: number;
    maxLevel: number;
    unsubscriber?: CallbackRemover;
    questionsAndResults?: Map<string, QuestionAndResult>;
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
        const unsubscriber = currentQuestionsAndResults.observe(questionsAndResults =>
            this.setState({ questionsAndResults })
        );
        this.setState({ unsubscriber });
    }

    componentWillUnmount() {
        this.state?.unsubscriber?.();
    }

    private onChangeLimit(newValue: string, field: string) {
        const value = newValue.match('^[0-9]+$') ? Number.parseInt(newValue) : null;
        const s: any = {}; // FIXME-any
        s[field] = value;
        this.setState(s);
    }

    private openModal(question: Question) {
        this.setState({ modalQuestion: question });
    }

    private closeModal() {
        this.setState({ modalQuestion: undefined });
    }

    render() {
        if (!this.state) return null;

        const { questionsAndResults, minLevel, maxLevel } = this.state;
        if (!questionsAndResults) return null;

        const { t } = this.props;

        const sortedList = Array.from(questionsAndResults.values())
            .sort((a, b) => a.question.sortKey.localeCompare(b.question.sortKey));

        const atLevel = new Map<number, number>();
        sortedList.map(qr => {
            const level = qr.result.level;
            atLevel.set(level, (atLevel.get(level) || 0) + 1);
        });

        const filteredList = sortedList.filter(qr => (
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
                        className="modalContentClass container"
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
