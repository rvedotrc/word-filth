import * as React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';
import {AttemptRendererProps, CorrectResponseRendererProps, Question} from "../../CustomVocab/types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("../standard_form_question.css");

type Props<T, C, Q extends Question<T, C>> = {
    question: Q;
    attempts: T[];
    firstAttemptCorrect: boolean | undefined;
    onRecordResult: (isCorrect: boolean) => Promise<void>;
    onNextQuestion: () => void;
} & WithTranslation

type State<T, C> = {
    attemptComponent: React.FunctionComponent<AttemptRendererProps<T>>;
    correctResponseComponent: React.FunctionComponent<CorrectResponseRendererProps<C>>;
    isCorrect: boolean;
}

class Result<T, C, Q extends Question<T, C>> extends React.Component<Props<T, C, Q>, State<T, C>> {

    constructor(props: Props<T, C, Q>) {
        super(props);

        this.state = {
            attemptComponent: props.question.getAttemptComponent(),
            correctResponseComponent: props.question.getCorrectResponseComponent(),
            isCorrect: !!props.firstAttemptCorrect,
        };
    }

    render() {
        const {t} = this.props;

        const currentResult = this.state.isCorrect;

        const setIsCorrect = (to: boolean) => {
            this.props.onRecordResult(to);
            this.setState({ isCorrect: to });
        };

        return <div>
            <h2>Attempts</h2>
            <ol>
                {this.props.attempts.map((attempt, idx) =>
                    <this.state.attemptComponent
                        t={this.props.t}
                        i18n={this.props.i18n}
                        tReady={this.props.tReady}
                        attempt={attempt}
                        key={idx}
                    />
                )}
            </ol>

            <h2>Correct answers</h2>
            <this.state.correctResponseComponent
                t={this.props.t}
                i18n={this.props.i18n}
                tReady={this.props.tReady}
                correct={this.props.question.correct}
            />

            <p>
                <input
                    type="button"
                    value={"" + t('question.shared.continue.button')}
                    onClick={this.props.onNextQuestion}
                    autoFocus={true}
                    data-testid="continue"
                />
            </p>

            <div className={styles.gimmeBlock}>
                <div className={styles.gimmeMark}>{currentResult ? "✅" : "❌"}</div>
                <div className={styles.gimmeInputs}>
                    <label>
                        <input
                            type={"radio"}
                            name={"currentResult"}
                            checked={currentResult === true}
                            onChange={() => setIsCorrect(true)}
                        />
                        {t('question.shared.gimme.record_as_correct')}
                    </label>
                    <label>
                        <input
                            type={"radio"}
                            name={"currentResult"}
                            checked={currentResult === false}
                            onChange={() => setIsCorrect(false)}
                        />
                        {t('question.shared.gimme.record_as_incorrect')}
                    </label>
                </div>
            </div>

        </div>;
    }

}

(Result as any).displayName = 'SFQ2Result';

export default withTranslation()(Result);
