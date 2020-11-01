import * as React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';
import {Question, QuestionFormProps} from "../../CustomVocab/types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./form.css');

type Props<T, C, Q extends Question<T, C>> = {
    question: Q;
    onAttempt: (attempt: T, isCorrect: boolean) => void;
    onGiveUp: () => void;
    onNextQuestion: () => void;
} & WithTranslation

type State<AT> = {
    form: React.FunctionComponent<QuestionFormProps<AT>>;
    attempt: AT | undefined;
    fadingMessage: string | undefined;
}

class Form<T, C, Q extends Question<T, C>> extends React.Component<Props<T, C, Q>, State<T>> {

    constructor(props: Props<T, C, Q>) {
        super(props);

        this.state = {
            form: props.question.getQuestionFormComponent(),
            attempt: undefined,
            fadingMessage: undefined,
        };
    }

    private answer() {
        const {t, question} = this.props;
        const {attempt} = this.state;
        if (!attempt) return;

        const isCorrect = question.correct.some(correctAnswer =>
            question.doesAttemptMatchCorrectAnswer(attempt, correctAnswer)
        );

        this.props.onAttempt(attempt, isCorrect);
        if (!isCorrect) this.showFadingMessage(t('question.shared.not_correct'));
    }

    private showFadingMessage(message: string, timeout?: number) {
        this.setState({ fadingMessage: message });
        window.setTimeout(() => {
            this.setState(prevState => {
                if (prevState.fadingMessage === message) {
                    return({ fadingMessage: undefined });
                } else {
                    return null;
                }
            });
        }, timeout || 2500);
    }

    render() {
        const {t} = this.props;

        return <div>
            <form className={styles.question}
                onSubmit={e => { e.preventDefault(); this.answer(); }}
            >
                <this.state.form
                    t={this.props.t}
                    i18n={this.props.i18n}
                    tReady={this.props.tReady}
                    lang={this.props.question.lang}
                    onAttempt={(attempt: T) => this.setState({ attempt })}
                    onShowMessage={msg => this.showFadingMessage(msg)}
                />

                <p>
                    <input
                        type={"submit"}
                        disabled={this.state.attempt === undefined}
                        value={"" + t('question.shared.answer.button')}
                    />
                    <input
                        type={"reset"}
                        onClick={this.props.onGiveUp}
                        value={"" + t('question.shared.give_up.button')}
                    />
                    <input
                        type={"button"}
                        onClick={this.props.onNextQuestion}
                        value={"" + t('question.shared.skip.button')}
                    />
                </p>
            </form>

            {this.state.fadingMessage && <p>{this.state.fadingMessage}</p>}
        </div>;
    }

}

(Form as any).displayName = 'SFQ2Form';

export default withTranslation()(Form);
