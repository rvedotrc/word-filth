import * as React from "react";
import {WithTranslation, withTranslation} from 'react-i18next';
import {Question} from "../../words/CustomVocab/types";

interface Props extends WithTranslation {
    question: Question;
    onClose: () => void;
}

interface State {
    firstAnswer: boolean;
    hasGimme: boolean;
    gimmeUsed: boolean;
    log: string[];
}

class TestDriveQuestion extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            firstAnswer: true,
            hasGimme: false,
            gimmeUsed: false,
            log: [],
        }
    }

    addLog(line: string) {
        this.setState(prevState => {
            return {
                log: [].concat(prevState.log, [line]),
            };
        });
    }

    render() {
        const {question} = this.props;

        return (
            <div>
                <button onClick={this.props.onClose}>Close</button>

                <h2>Test Area</h2>
                <div className="container" style={{border: "1px solid red", padding: "1em"}}>
                    {question.createQuestionForm({
                        // There must be a better way of doing this ...
                        t: this.props.t,
                        i18n: this.props.i18n,
                        tReady: this.props.tReady,

                        key: question.resultsKey,
                        hasGimme: this.state.hasGimme,
                        gimmeUsed: this.state.gimmeUsed,
                        onResult: isCorrect => {
                            this.addLog(`onResult(${isCorrect})`);
                            if (this.state.firstAnswer) {
                                this.setState({ firstAnswer: false, hasGimme: !isCorrect });
                            }
                        },
                        onGimme: () => {
                            this.addLog('onGimme()');
                            this.setState({ gimmeUsed: true });
                        },
                        onDone: () => {
                            this.addLog('onDone()');
                        },
                    })}
                </div>

                <h2>Callbacks</h2>
                <pre>{this.state.log.join('\n')}</pre>

                <h2>Question Data</h2>
                <pre>{JSON.stringify(question, null, 2)}</pre>
            </div>
        );
    }
}

export default withTranslation()(TestDriveQuestion);
