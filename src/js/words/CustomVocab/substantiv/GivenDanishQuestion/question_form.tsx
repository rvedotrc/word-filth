import * as React from 'react';
import { withTranslation } from 'react-i18next';

import * as stdq from "../../../shared/standard_form_question";

export interface Props extends stdq.Props {
    question: any;
}

export interface State extends stdq.State<Attempt> {
    engelsk: string;
}

export interface Attempt {
    engelsk: string;
}

class QuestionForm extends stdq.QuestionForm<Props, State, Attempt> {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.defaultState(),
            engelsk: '',
        };
    }

    handleChange(event: any, field: string) {
        const newState: any = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    getGivenAnswer(): Attempt {
        const { t } = this.props;
        const engelsk = this.state.engelsk.trim().toLowerCase();

        if (engelsk === '') {
            this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
            return;
        }

        return { engelsk };
    }

    checkAnswer(attempt: Attempt) {
        const stripArticle = (t: string) => t.replace(/^an? /, '');
        return this.props.question.answers.some(
            (allowable: any) => stripArticle(attempt.engelsk.toLowerCase()) === stripArticle(allowable.engelsk.toLowerCase())
        );
    }

    allGivenAnswers(givenAnswers: Attempt[]): React.ReactFragment {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        const t = givenAnswers
            .map(givenAnswer => givenAnswer.engelsk as React.ReactFragment)
            .reduce((prev, curr) => <>{prev}<br key="br"/>{'så: '}{curr}</>);

        return t;
    }

    allAllowableAnswers(): React.ReactFragment {
        if (this.props.question.answers.length === 0) return '-';

        // TODO: t complex
        const t = (this.props.question.answers as Attempt[])
            .map(answer => answer.engelsk)
            .sort()
            .map((answer: React.ReactFragment) => <b>{answer}</b>)
            .reduce((prev, curr) => <>{prev}{' eller '}{curr}</>);

        return t;
    }

    renderShowCorrectAnswer(givenAnswers: Attempt[]) {
        const { t } = this.props;

        return (
            <div>
                <p>
                    {t('question.shared.wrong.you_answered')}{' '}
                    {this.allGivenAnswers(givenAnswers)}
                </p>
                <p>
                    {t('question.shared.wrong.but_it_was')}{' '}
                    {this.allAllowableAnswers()}
                </p>
            </div>
        );
    }

    renderPraise() {
        const { t } = this.props;

        return (
            <div>
                <p>{t('question.shared.correct')}</p>
                <p>{this.allAllowableAnswers()}</p>
            </div>
        );
    }

    renderQuestionForm() {
        const { t, question } = this.props;

        return (
            <div>
                <p>
                    {t('question.shared.how_do_you_say_in_english', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        danish: <span>
                    {question.køn !== 'pluralis' ? (
                        <span>({question.køn}) <b>{question.ubestemtEntalEllerFlertal}</b></span>
                    ) : (
                        <b>{question.ubestemtEntalEllerFlertal}</b>
                    )}</span>
                    })}
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{t('question.shared.label.english')}</td>
                        <td>
                            <input
                                type="text"
                                size={30}
                                value={this.state.engelsk}
                                onChange={(e) => this.handleChange(e, 'engelsk')}
                                autoFocus={true}
                                data-test-id="answer"
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withTranslation()(QuestionForm);
