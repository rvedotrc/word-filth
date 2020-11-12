import * as React from "react";
import { withTranslation, WithTranslation } from 'react-i18next';
import {Question, Result} from "lib/types/question";

export type RowProps = {
    question: Question<any, any>;
    result: Result;
    showDebug: boolean;
    openModal: (question: Question<any, any>) => void;
    now: number;
} & WithTranslation

const ShowResultsRow = (props: RowProps) => {
    const { t, question, result } = props;

    const showTime = (t: number): string => {
        const days = Math.floor((t - props.now) / 1000 / 86400);
        if (days < 1) return "<1";
        return "+" + days;
    };

    return (
        <tr>
            {props.showDebug && <td>
                {question.resultsKey}
            </td>}
            {props.showDebug && <td>
                <button onClick={() => props.openModal(question)}>Q</button>
            </td>}
            <td>{question.resultsLabel}</td>
            <td>{question.answersLabel}</td>
            <td>{result.level || 0}</td>
            <td>{result.history ? result.history.length : 0}</td>
            <td>{(result.nextTimestamp && result.nextTimestamp > props.now)
                ? showTime(result.nextTimestamp)
                : t('show_results.table.body.now')
            }</td>
        </tr>
    );
};

export default withTranslation()(ShowResultsRow);
