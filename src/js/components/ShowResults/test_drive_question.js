import React, { Component } from "react";
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class TestDriveQuestion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstAnswer: true,
            hasGimme: false,
            gimmeUsed: false,
            log: [],
        }
    }

    addLog(line) {
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
                        key: question.resultsKey,
                        t: this.props.t,
                        i18n: this.props.i18n,
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

TestDriveQuestion.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    question: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default withTranslation()(TestDriveQuestion);
