import * as React from 'react';
import { withTranslation } from 'react-i18next';

import * as stdq from "../../../shared/standard_form_question";
import Bøjning from "../../../../shared/bøjning";

import Question from "./index";

export interface Props extends stdq.Props {
    question: Question;
}

export interface State extends stdq.State<Attempt> {
    tFormValue: string;
    langFormValue: string;
    komparativValue: string;
    superlativValue: string;
}

export interface Attempt {
    tForm: string;
    langForm: string;
    komparativ: string;
    superlativ: string;
}

class QuestionForm extends stdq.QuestionForm<Props, State, Attempt> {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.defaultState(),
            tFormValue: '',
            langFormValue: '',
            komparativValue: '',
            superlativValue: '',
        };
    }

    handleChange(event: any, field: string) {
        const newState: any = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    onBlur(field: string) {
        this.setState((prevState: any) => {
            const expanded = new Bøjning().bøj(this.props.question.grundForm, prevState[field]);
            const newState: any = {};
            newState[field] = expanded;
            return newState;
        });
    }

    getGivenAnswer() {
        const { t } = this.props;

        this.onBlur('tFormValue');
        this.onBlur('langFormValue');
        this.onBlur('komparativValue');
        this.onBlur('superlativValue');

        const tForm = this.state.tFormValue.trim().toLowerCase();
        const langForm = this.state.langFormValue.trim().toLowerCase();
        const komparativ = this.state.komparativValue.trim().toLowerCase();
        const superlativ = this.state.superlativValue.trim().toLowerCase();

        if (tForm === '' || langForm === '' || ((komparativ === '') != (superlativ === ''))) {
            this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
            return;
        }

        return { tForm, langForm, komparativ, superlativ };
    }

    checkAnswer(attempt: Attempt) {
        const { question } = this.props;

        return question.answers.some((answer: any) => (
            attempt.tForm === answer.tForm
            && attempt.langForm === answer.langForm
            && attempt.komparativ === (answer.komparativ || '')
            && attempt.superlativ === (answer.superlativ || '')
        ));
    }

    formatAnswer(answer: Attempt) {
        return [
            this.props.question.grundForm,
            answer.tForm,
            answer.langForm,
            answer.komparativ,
            answer.superlativ,
        ].filter(v => v).join(', ');
    }

    allGivenAnswers(givenAnswers: Attempt[]): React.ReactFragment {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        const t = givenAnswers
            .map(answer => this.formatAnswer(answer))
            .map((sv, index) => <span key={index}>{sv}</span>)
            .reduce((prev, curr) => <>{prev}<br key="br"/>{'så: '}{curr}</>);

        return <span>{t}</span>;
    }

    allAllowableAnswers(): React.ReactFragment {
        // TODO: t complex
        const t = (this.props.question.answers as Attempt[])
            .map(answer => this.formatAnswer(answer))
            .sort()
            .map((sv) => <>
                <b>{sv}</b>
                {' '}({this.props.question.engelsk})
            </>)
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
        const { question } = this.props;

        // TODO: i18n

        return (
            <div>
                <p>
                    How do you form the adjective{' '}
                    <b key="grundForm">{question.grundForm}</b>
                    {question.engelsk && (<span> ({question.engelsk})</span>)}
                    ?
                </p>

                <table>
                    <tbody>
                        <tr>
                            <td>grund form:</td>
                            <td>{question.grundForm}</td>
                        </tr>
                        <tr>
                            <td>t-form:</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.tFormValue}
                                    onChange={(e) => this.handleChange(e, 'tFormValue')}
                                    onBlur={() => this.onBlur('tFormValue')}
                                    data-test-id="tForm"
                                    autoFocus={true}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>lang form:</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.langFormValue}
                                    onChange={(e) => this.handleChange(e, 'langFormValue')}
                                    onBlur={() => this.onBlur('langFormValue')}
                                    data-test-id="langForm"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>komparativ:</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.komparativValue}
                                    onChange={(e) => this.handleChange(e, 'komparativValue')}
                                    onBlur={() => this.onBlur('komparativValue')}
                                    data-test-id="komparativ"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>superlativ:</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.superlativValue}
                                    onChange={(e) => this.handleChange(e, 'superlativValue')}
                                    onBlur={() => this.onBlur('superlativValue')}
                                    data-test-id="superlativ"
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
