import * as React from "react";
import { withTranslation, WithTranslation } from 'react-i18next';
import {Question} from "../../words/CustomVocab/types";
import {Result} from "../../Questions/types";

export type RowProps = {
    question: Question;
    result: Result;
    showDebug: boolean;
    openModal: (question: Question) => void;
} & WithTranslation

class ShowResultsRow extends React.Component<RowProps, never> {
    constructor(props: RowProps) {
        super(props);
    }

    render() {
        const { t, question, result } = this.props;
        return (
            <tr>
                {this.props.showDebug && <td>
                    {question.resultsKey}
                </td>}
                {this.props.showDebug && <td>
                    <button onClick={() => this.props.openModal(question)}>Q</button>
                </td>}
                <td>{question.resultsLabel}</td>
                <td>{question.answersLabel}</td>
                <td>{result.level || 0}</td>
                <td>{result.history ? result.history.length : 0}</td>
                <td>{result.nextTimestamp
                    ? new Date(result.nextTimestamp).toDateString()
                    : t('show_results.table.body.now')
                }</td>
            </tr>
        )
    }
}

export default withTranslation()(ShowResultsRow);
