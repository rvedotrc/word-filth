import * as React from 'react';
import { WithTranslation } from 'react-i18next';

export type Props = {
    key: React.Key;

    onResult: (isCorrect: boolean) => Promise<void>;
    currentResult: boolean | undefined;
    onDone: () => void;
} & WithTranslation

export type State<AT> = {
    attempts: AT[];
    fadingMessage: string | null;
    showPraise: boolean;
    showCorrectAnswer: boolean;
    showFormHelp: boolean;
}

export abstract class QuestionForm<PT extends Props, ST extends State<Attempt>, Attempt> extends React.Component<PT, ST> {
    constructor(props: PT) {
        super(props);
    }

    defaultState(): State<Attempt> {
        return {
            attempts: [],
            fadingMessage: null,
            showPraise: false,
            showCorrectAnswer: false,
            showFormHelp: false,
        };
    }

    abstract renderShowCorrectAnswer(givenAnswers: Attempt[]) : React.ReactFragment;
    abstract renderPraise() : React.ReactFragment;
    abstract renderQuestionForm() : React.ReactFragment;

    abstract getGivenAnswer(): Attempt | false | undefined;
    abstract checkAnswer(givenAnswer: Attempt): boolean;

    onAnswer(): void {
        const { t, currentResult } = this.props;

        const givenAnswer = this.getGivenAnswer();

        if (givenAnswer === false) return;

        if (givenAnswer === undefined) {
            this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
            return;
        }

        const attempts = this.state.attempts.concat(givenAnswer);
        this.setState({ attempts });

        const isCorrect = this.checkAnswer(givenAnswer);

        if (!isCorrect) this.showFadingMessage(t('question.shared.not_correct'));

        const promise = (currentResult === undefined)
            ? this.props.onResult(isCorrect)
            : Promise.resolve();

        promise.then(() =>
            isCorrect && this.setState({ showPraise: true })
        );
    }

    onGiveUp(): void {
        this.props.onResult(false).then(() =>
            this.setState({ showCorrectAnswer: true })
        );
    }

    showFadingMessage(message: string, timeout?: number) {
        this.setState({ fadingMessage: message });
        window.setTimeout(() => {
            this.setState(prevState => {
                if (prevState.fadingMessage === message) {
                    return({ fadingMessage: null });
                } else {
                    return null;
                }
            });
        }, timeout || 2500);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderFormHelp(probe: boolean): React.ReactFragment | undefined {
        return;
    }

    render() {
        const { t, onResult, currentResult } = this.props;
        const { showCorrectAnswer, showPraise } = this.state;

        if (showCorrectAnswer || showPraise) {
            return (
                <div>
                    {
                        showCorrectAnswer
                        ? this.renderShowCorrectAnswer(this.state.attempts)
                        : this.renderPraise()
                    }
                    <p>
                        <input
                            type="button"
                            value={"" + t('question.shared.continue.button')}
                            onClick={this.props.onDone}
                            autoFocus={true}
                            data-testid="continue"
                        />
                    </p>
                    <div style={{fontSize: '500%'}}>
                        {currentResult ? "✅" : "❌"}
                    </div>
                    {/*TODO i18n*/}
                    <p>
                        <input
                            type={"radio"}
                            name={"currentResult"}
                            checked={currentResult === true}
                            onChange={() => this.props.onResult(true)}
                        /> Record as correct
                        <br/>
                        <input
                            type={"radio"}
                            name={"currentResult"}
                            checked={currentResult === false}
                            onChange={() => this.props.onResult(false)}
                        /> Record as incorrect
                    </p>
                </div>
            );
        }

        const { fadingMessage } = this.state;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onAnswer(); }}
                onReset={(e) => { e.preventDefault(); this.onGiveUp(); }}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
            >
                {this.renderQuestionForm()}

                <p>
                    <input type="submit" value={"" + t('question.shared.answer.button')}/>
                    <input type="reset" value={"" + t('question.shared.give_up.button')}/>
                    <input type="button" value={"" + t('question.shared.skip.button')} onClick={this.props.onDone}/>

                    {this.renderFormHelp(true) && (
                        <input
                            type="reset"
                            value={"" + t('question.shared.help.button')}
                            onClick={e => {
                                e.preventDefault();
                                this.setState({showFormHelp: !this.state.showFormHelp});
                            }}
                        />
                    )}
                </p>

                {this.state.showFormHelp && this.renderFormHelp(false)}

                {fadingMessage && (
                    <p key={fadingMessage as string}>{fadingMessage}</p>
                )}
            </form>
        );
    }

}
