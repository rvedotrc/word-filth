import * as React from 'react';
import { withTranslation } from 'react-i18next';

import GenderInput from "../../../../components/shared/gender_input";
import * as stdq from "../../../shared/standard_form_question";

export interface Props extends stdq.Props {
    question: any;
}

export interface State extends stdq.State<Attempt> {
    kønValue: string;
    ubestemtEntalValue: string;
}

export interface Attempt {
    køn: string;
    ubestemtEntal: string;
}

class QuestionForm extends stdq.QuestionForm<Props, State, Attempt> {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.defaultState(),
            kønValue: '',
            ubestemtEntalValue: '',
        };
    }

    handleKøn(value: string) {
        this.setState({ kønValue:  value });
    }

    handleChange(event: any, field: string) {
        const newState: any = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    getGivenAnswer() {
        const {t} = this.props;
        const køn = this.state.kønValue;
        const ubestemtEntal = this.state.ubestemtEntalValue.trim().toLowerCase();

        if (!køn || ubestemtEntal === '') {
            this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
            return;
        }

        return { køn, ubestemtEntal };
    }

    checkAnswer({ køn, ubestemtEntal }: Attempt) {
        const { question } = this.props;

        return question.answers.some((answer: any) => (
            køn === answer.køn
            && ubestemtEntal.toLowerCase() === answer.ubestemtEntal.toLowerCase()
        ));
    }

    allGivenAnswers(givenAnswers: Attempt[]): React.ReactFragment {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        const t = givenAnswers
            .map(answer => `${answer.køn} ${answer.ubestemtEntal}`)
            .map(sv => <>{sv}</>)
            .reduce((prev, curr) => <>{prev}<br key="br"/>{'så: '}{curr}</>);

        return t;
    }

    allAllowableAnswers(): React.ReactFragment {
        // TODO: t complex
        const t: string[] = this.props.question.answers
            .map((answer: any) => `${answer.køn} ${answer.ubestemtEntal}`)
            .sort();

        const x = t
            .map(sv => <b>{sv}</b>)
            .reduce((prev, curr) => <>{prev}{' eller '}{curr}</>);

        return x;
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

        const engelskArtikel = (
            question.engelsk.match(/^[aeiou]/)
                ? 'an'
                : 'a'
        );

        return (
            <div>
                <p>
                    {t('question.shared.how_do_you_say_in_danish', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        english: <b>{engelskArtikel} {question.engelsk}</b>,
                    })}
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{t('question.shared.label.danish')}</td>
                        <td>
                            <span style={{margin: 'auto 0.5em'}}>
                                <GenderInput
                                    value={this.state.kønValue}
                                    onChange={v => this.handleKøn(v)}
                                    autoFocus={true}
                                    data-test-id="køn"
                                />
                            </span>
                            <input
                                type="text"
                                size={30}
                                value={this.state.ubestemtEntalValue}
                                onChange={(e) => this.handleChange(e, 'ubestemtEntalValue')}
                                data-test-id="ubestemtEntal"
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