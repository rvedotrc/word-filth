import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

declare const firebase: typeof import('firebase');

import ShowResultsRow from './row';
import TestDriveQuestion from "./test_drive_question";
import CountsByLevel from "./counts_by_level";
import {Question, QuestionAndResult} from "lib/types/question";
import {currentQuestionsAndResults} from "lib/app_context";
import {useEffect, useState} from "react";
import DelayedSearchInput from "@components/MyVocab/delayed_search_input";

type Props = {
    user: firebase.User;
} & WithTranslation

const onChangeLimit = (newValue: string, setter: (value?: number) => void) => {
    const value = newValue.match('^[0-9]+$') ? Number.parseInt(newValue) : undefined;
    setter(value);
};

const ShowResults = (props: Props) => {
    const [minLevel, setMinLevel] = useState<number>();
    const [maxLevel, setMaxLevel] = useState<number>();
    const [showDebug, setShowDebug] = useState<boolean>(false);
    const [modalQuestion, setModalQuestion] = useState<Question<any, any>>();
    const [search, setSearch] = useState<string>("");

    const [questionsAndResults, setQuestionsAndResults]
        = useState<Map<string, QuestionAndResult>>(
            currentQuestionsAndResults.getValue()
    );

    useEffect(() => currentQuestionsAndResults.observe(setQuestionsAndResults), [])

    const { t } = props;

    const sortedList = Array.from(questionsAndResults.values())
        .sort((a, b) => a.question.sortKey.localeCompare(b.question.sortKey));

    const atLevel = new Map<number, number>();
    sortedList.map(qr => {
        const level = qr.result.level;
        atLevel.set(level, (atLevel.get(level) || 0) + 1);
    });

    const lcSearch = search.toLocaleLowerCase();
    const matches = (q: Question<any, any>): boolean => (
        q.resultsLabel.toLocaleLowerCase().indexOf(lcSearch) >= 0
        ||
        q.answersLabel.toLocaleLowerCase().indexOf(lcSearch) >= 0
    );

    const filteredList = sortedList.filter(qr => (
        (minLevel === undefined || qr.result.level >= minLevel)
        &&
        (maxLevel === undefined || qr.result.level <= maxLevel)
        &&
        (!search || matches(qr.question))
    ));

    const canShowDebug = (window.location.hostname === 'localhost');

    const now = new Date().getTime();

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
                        value={minLevel ?? ""}
                        onChange={e => onChangeLimit(e.target.value, setMinLevel)}
                    />,
                    to: <input
                        type="text"
                        maxLength={1}
                        size={3}
                        value={maxLevel ?? ""}
                        onChange={e => onChangeLimit(e.target.value, setMaxLevel)}
                    />
                })}
            </p>

            {canShowDebug && <p>
                <label>
                    <input
                        type="checkbox"
                        checked={showDebug}
                        onChange={e => setShowDebug(e.target.checked)}
                    />
                    Show debug
                </label>
            </p>}

            {modalQuestion && <div>
                <div>
                    <TestDriveQuestion
                        question={modalQuestion}
                        onClose={() => setModalQuestion(undefined)}
                    />
                </div>
            </div>}

            <p>
                {t('my_vocab.search.label') + ' '}
                <DelayedSearchInput
                    defaultValue={""}
                    delayMillis={250}
                    onChange={setSearch}
                    autoFocus={true}/>
            </p>

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
                            openModal={q => setModalQuestion(q)}
                            now={now}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default withTranslation()(ShowResults);
