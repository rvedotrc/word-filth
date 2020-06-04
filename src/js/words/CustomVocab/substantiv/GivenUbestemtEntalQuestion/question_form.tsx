import * as React from 'react';
import { withTranslation } from 'react-i18next';

import GenderInput from "../../../../components/shared/gender_input";
import * as stdq from "../../../shared/standard_form_question";
import {unique} from "lib/unique-by";
import GivenUbestemtEntalQuestion from "./index";
import Bøjning from "../../../../shared/bøjning";

export interface Props extends stdq.Props {
    question: GivenUbestemtEntalQuestion;
}

export interface State extends stdq.State<Attempt> {
    kønValue: string;
    bestemtEntalValue: string;
    ubestemtFlertalValue: string;
    bestemtFlertalValue: string;
}

export interface Attempt {
    køn: string;
    bestemtEntal: string;
    ubestemtFlertal: string;
    bestemtFlertal: string;
}

class QuestionForm extends stdq.QuestionForm<Props, State, Attempt> {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.defaultState(),
            kønValue: '',
            bestemtEntalValue: '',
            ubestemtFlertalValue: '',
            bestemtFlertalValue: '',
        };
    }

    handleKøn(value: string) {
        this.setState({ kønValue:  value });
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>, field: "kønValue" | "bestemtEntalValue" | "ubestemtFlertalValue" | "bestemtFlertalValue") {
        const newState: State = { ...this.state };
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    onBlur(field: "bestemtEntalValue" | "ubestemtFlertalValue" | "bestemtFlertalValue") {
        this.setState((prevState: State) => {
            const expanded = new Bøjning().bøj(this.props.question.ubestemtEntal, prevState[field]);
            const newState: State = {...prevState};
            newState[field] = expanded;
            return newState;
        });
    }

    getGivenAnswer() {
        const {t} = this.props;
        const køn = this.state.kønValue;

        if (!køn) {
            this.showFadingMessage(t('question.substantiv.given_ubestemt_ental.all_forms_required'));
            return;
        }

        const process = (t: string) => new Bøjning().bøj(
            this.props.question.ubestemtEntal, t.trim().toLowerCase()
        );

        const bestemtEntal = process(this.state.bestemtEntalValue);
        const ubestemtFlertal = process(this.state.ubestemtFlertalValue);
        const bestemtFlertal = process(this.state.bestemtFlertalValue);

        return { køn, bestemtEntal, ubestemtFlertal, bestemtFlertal };
    }

    checkAnswer({ køn, bestemtEntal, ubestemtFlertal, bestemtFlertal }: Attempt) {
        const { question } = this.props;

        return question.answers.some(answer => (
            køn === answer.køn
            && bestemtEntal.toLowerCase() === (answer.bestemtEntal || '').toLowerCase()
            && ubestemtFlertal.toLowerCase() === (answer.ubestemtFlertal || '').toLowerCase()
            && bestemtFlertal.toLowerCase() === (answer.bestemtFlertal || '').toLowerCase()
        ));
    }

    allGivenAnswers(givenAnswers: Attempt[]): React.ReactFragment {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        const t = givenAnswers
            .map(answer => [
                answer.køn,
                answer.bestemtEntal,
                answer.ubestemtFlertal,
                answer.bestemtFlertal,
            ].filter(t => t).join(', '))
            .map(sv => <>{sv}</>)
            .reduce((prev, curr) => <span>{prev}<br key="br"/>{'så: '}{curr}</span>);

        return t;
    }

    allAllowableAnswers(): React.ReactFragment {
        // TODO: t complex
        const t = this.props.question.answers
            .map(answer => [
                answer.køn,
                answer.bestemtEntal,
                answer.ubestemtFlertal,
                answer.bestemtFlertal,
            ].filter(t => t).join(', '))
            .sort();

        const x = unique(t)
            .map((sv: string, index: number) => <b>{sv}</b>)
            .reduce((prev, curr) => <>{prev}{' eller '}{curr}</>);

        return <span>{x}</span>;
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
                    {t('question.substantiv.given_ubestemt_ental.question', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        ubestemtEntal: <b>{question.ubestemtEntal}</b>,
                    })}
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{t('question.substantiv.given_ubestemt_ental.gender.label')}</td>
                        <td>
                            <span style={{margin: 'auto 0.5em'}}>
                                <GenderInput
                                    value={this.state.kønValue}
                                    onChange={v => this.handleKøn(v)}
                                    autoFocus={true}
                                    data-test-id="køn"
                                />
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>{t('question.substantiv.given_ubestemt_ental.bestemtEntal.label')}</td>
                        <td>
                            <input
                                type="text"
                                size={30}
                                value={this.state.bestemtEntalValue}
                                onChange={(e) => this.handleChange(e, 'bestemtEntalValue')}
                                onBlur={(e) => this.onBlur('bestemtEntalValue')}
                                data-test-id="bestemtEntal"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>{t('question.substantiv.given_ubestemt_ental.ubestemtFlertal.label')}</td>
                        <td>
                            <input
                                type="text"
                                size={30}
                                value={this.state.ubestemtFlertalValue}
                                onChange={(e) => this.handleChange(e, 'ubestemtFlertalValue')}
                                onBlur={(e) => this.onBlur('ubestemtFlertalValue')}
                                data-test-id="ubestemtFlertal"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>{t('question.substantiv.given_ubestemt_ental.bestemtFlertal.label')}</td>
                        <td>
                            <input
                                type="text"
                                size={30}
                                value={this.state.bestemtFlertalValue}
                                onChange={(e) => this.handleChange(e, 'bestemtFlertalValue')}
                                onBlur={(e) => this.onBlur('bestemtFlertalValue')}
                                data-test-id="bestemtFlertal"
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
