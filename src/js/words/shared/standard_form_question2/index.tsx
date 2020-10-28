import * as React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';

import {Question, QuestionHeaderProps} from "../../CustomVocab/types";
import Form from "./form";
import Result from "./result";
import {Recorder} from "../../../SpacedRepetition";

type Props<AT> = {
    recorder: Recorder;
    question: Question<any, any>;
    onDone: () => void;
} & WithTranslation

type State<T, C> = {
    header: React.FunctionComponent<QuestionHeaderProps<T, C, Question<T, C>>>;
    attempts: T[];
    firstAttemptCorrect: boolean | undefined;
    answering: boolean;
}

class SFQ2<T, C> extends React.Component<Props<T>, State<T, C>> {

    constructor(props: Props<T>) {
        super(props);

        this.state = {
            header: props.question.getQuestionHeaderComponent(),
            attempts: [],
            firstAttemptCorrect: undefined,
            answering: true,
        };
    }

    private onAttempt(attempt: T, isCorrect: boolean) {
        const {attempts} = this.state;

        if (attempts.length === 0) {
            this.props.recorder.recordAnswer(isCorrect);

            this.setState({
                firstAttemptCorrect: isCorrect,
            });
        }

        this.setState({
            attempts: [...attempts, attempt],
            answering: !isCorrect,
        });
    }

    private giveUp() {
        if (this.state.attempts.length === 0) {
            this.props.recorder.recordAnswer(false);
        }

        this.setState({ answering: false });
    }

    private recordResult(isCorrect: boolean): Promise<void> {
        return this.props.recorder.recordAnswer(isCorrect);
    }

    render() {
        const { answering } = this.state;

        return <>
            <this.state.header
                t={this.props.t}
                i18n={this.props.i18n}
                tReady={this.props.tReady}
                question={this.props.question}
            />

            <hr/>

            {answering
                ? <Form
                    question={this.props.question}
                    onNextQuestion={this.props.onDone}
                    onAttempt={(attempt: T, isCorrect: boolean) => this.onAttempt(attempt, isCorrect)}
                    onGiveUp={() => this.giveUp()}
                />
                : <Result
                    question={this.props.question}
                    attempts={this.state.attempts}
                    firstAttemptCorrect={this.state.firstAttemptCorrect}
                    onRecordResult={isCorrect => this.recordResult(isCorrect)}
                    onNextQuestion={this.props.onDone}
                />
            }
        </>;
    }

}

export default withTranslation()(SFQ2);
