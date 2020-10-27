import * as React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';
import {Question, QuestionFormProps} from "../../CustomVocab/types";

type Props<AT, Q extends Question<AT>> = {
    question: Q;
    onAttempt: (attempt: AT, isCorrect: boolean) => void;
    onGiveUp: () => void;
    onNextQuestion: () => void;
} & WithTranslation

type State<AT> = {
    form: React.FunctionComponent<QuestionFormProps<AT, Question<AT>>>;
    attempt: AT | undefined;
    fadingMessage: string | undefined;
}

class Form<AT, Q extends Question<AT>> extends React.Component<Props<AT, Q>, State<AT>> {

    constructor(props: Props<AT, Q>) {
        super(props);

        this.state = {
            form: props.question.getQuestionFormComponent(),
            attempt: undefined,
            fadingMessage: undefined,
        };
    }

    private answer() {
        const {t} = this.props;
        const {attempt} = this.state;
        if (!attempt) return;

        const isCorrect = this.props.question.isAttemptCorrect(attempt);
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
            <form
                onSubmit={e => { e.preventDefault(); this.answer(); }}
            >
                <this.state.form
                    t={this.props.t}
                    i18n={this.props.i18n}
                    tReady={this.props.tReady}
                    question={this.props.question}
                    onAttempt={(attempt: AT) => this.setState({ attempt })}
                    onShowMessage={msg => this.showFadingMessage(msg)}
                />

                <p>
                    <input
                        type={"submit"}
                        disabled={this.state.attempt === undefined}
                        value={"" + t('question.shared.answer.button')}
                    />
                    <button onClick={this.props.onGiveUp}>{"" + t('question.shared.give_up.button')}</button>
                    <button onClick={this.props.onNextQuestion}>{"" + t('question.shared.skip.button')}</button>
                </p>
            </form>

            {this.state.fadingMessage && <p>{this.state.fadingMessage}</p>}
        </div>;
    }

}

(Form as any).displayName = 'SFQ2Form';

export default withTranslation()(Form);
