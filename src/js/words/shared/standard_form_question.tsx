import * as React from 'react';
import { WithTranslation } from 'react-i18next';

export interface Props extends WithTranslation {
    hasGimme: boolean;
    gimmeUsed: boolean;

    onResult: (isCorrect: boolean) => void;
    onGimme: () => void;
    onDone: () => void;
}

export interface State<AT> {
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

    abstract getGivenAnswer(): Attempt | undefined;
    abstract checkAnswer(givenAnswer: Attempt): boolean;

    onAnswer(): void {
        const { t } = this.props;

        const givenAnswer = this.getGivenAnswer();
        if (givenAnswer === undefined) return;

        if (!givenAnswer) {
            this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
            return;
        }

        const isCorrect = this.checkAnswer(givenAnswer);
        this.props.onResult(isCorrect);

        if (isCorrect) {
            this.setState({ showPraise: true });
        } else {
            const attempts = this.state.attempts.concat(givenAnswer);
            this.setState({ attempts });
            this.showFadingMessage(t('question.shared.not_correct'));
        }
    };

    onGiveUp(): void {
        this.props.onResult(false);
        this.setState({ showCorrectAnswer: true });
    };

    showFadingMessage(message: string, timeout?: number) {
        this.setState({ fadingMessage: message });
        const t = this;
        window.setTimeout(() => {
            t.setState(prevState => {
                if (prevState.fadingMessage === message) {
                    return({ fadingMessage: null });
                } else {
                    return null;
                }
            });
        }, timeout || 2500);
    }

    renderFormHelp(_probe: boolean): React.ReactFragment {
        return undefined;
    }

    render() {
        const { t } = this.props;

        if (this.state.showCorrectAnswer) {
            return (
                <div>
                    {this.renderShowCorrectAnswer(this.state.attempts)}
                    <p>
                        <input
                            type="button"
                            value={"" + t('question.shared.continue.button')}
                            onClick={this.props.onDone}
                            autoFocus={true}
                            data-test-id="continue"
                        />
                        {this.props.hasGimme && (
                            <input
                                type="button"
                                value={"" + t('question.shared.gimme.button')}
                                disabled={this.props.gimmeUsed}
                                onClick={this.props.onGimme}
                                data-test-id="gimme"
                                className="gimme"
                            />
                        )}
                    </p>
                </div>
            );
        }

        if (this.state.showPraise) {
            return (
                <div>
                    {this.renderPraise()}
                    <p>
                        <input
                            type="button"
                            value={"" + t('question.shared.continue.button')}
                            onClick={this.props.onDone}
                            autoFocus={true}
                        />
                        {this.props.hasGimme && (
                            <input
                                type="button"
                                value={"" + t('question.shared.gimme.button')}
                                disabled={this.props.gimmeUsed}
                                onClick={this.props.onGimme}
                                data-test-id="gimme"
                                className="gimme"
                            />
                        )}
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
                    <p key={fadingMessage}>{fadingMessage}</p>
                )}
            </form>
        );
    };

}
