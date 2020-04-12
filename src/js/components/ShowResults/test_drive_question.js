import React, { Component } from "react";
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class TestDriveQuestion extends Component {

    constructor(props) {
        super(props);
        this.state = {
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

                <h2>Question Data</h2>
                <pre>{JSON.stringify(question, null, 2)}</pre>

                <h2>Test Area</h2>
                <div style={{border: "1px solid red", padding: "1em"}}>
                    {question.createQuestionForm({
                        key: question.resultsKey,
                        t: this.props.t,
                        i18n: this.props.i18n,
                        hasGimme: false,
                        gimmeUsed: false,
                        onResult: isCorrect => this.addLog(`onResult(${isCorrect})`),
                        onGimme: () => this.addLog('onGimme()'),
                        onDone: () => this.addLog('onDone()'),
                    })}
                </div>

                <h2>Callbacks</h2>
                <pre>{this.state.log.join('\n')}</pre>

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
