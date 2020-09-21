import * as React from 'react';
import { withTranslation } from 'react-i18next';

import GenderInput from "@components/shared/gender_input";
import * as stdq from "../../../shared/standard_form_question";
import {unique} from "lib/unique-by";
import GivenUbestemtEntalQuestion from "./index";
import {TFunction} from "i18next";
import ShowVocabSources from "../../../shared/show_vocab_sources";
import {bøj} from "lib/bøjning";

export type Props = {
    question: GivenUbestemtEntalQuestion;
} & stdq.Props

export type State = {
    kønValue: string | null;
    bestemtEntalValue: string;
    ubestemtFlertalValue: string;
    bestemtFlertalValue: string;
} & stdq.State<Attempt>

export type Attempt = {
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

    handleKøn(value: string | null) {
        this.setState({ kønValue:  value });
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>, field: "kønValue" | "bestemtEntalValue" | "ubestemtFlertalValue" | "bestemtFlertalValue") {
        const newState: State = { ...this.state };
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    onBlur(field: "bestemtEntalValue" | "ubestemtFlertalValue" | "bestemtFlertalValue") {
        this.setState((prevState: State) => {
            const expanded = bøj(this.props.question.ubestemtEntal, prevState[field]);
            const newState: State = {...prevState};
            newState[field] = expanded;
            return newState;
        });
    }

    getGivenAnswer() {
        const {t} = this.props;
        const køn = this.state.kønValue;

        this.onBlur('bestemtEntalValue');
        this.onBlur('ubestemtFlertalValue');
        this.onBlur('bestemtFlertalValue');

        if (!køn) {
            this.showFadingMessage(t('question.substantiv.given_ubestemt_ental.all_forms_required'));
            return false;
        }

        const process = (s: string) => bøj(
            this.props.question.ubestemtEntal, s.trim().toLowerCase()
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
            ].filter(s => s).join(', '))
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
            ].filter(s => s).join(', '))
            .sort();

        const inner = unique(t)
            .map((sv: string, index: number) => <b key={index}>{sv}</b>)
            .reduce((prev, curr) => <>{prev}{' eller '}{curr}</>);

        return <span>{inner}</span>;
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
                <ShowVocabSources vocabSources={this.props.question.vocabSources}/>
            </div>
        );
    }

    renderPraise() {
        const { t } = this.props;

        return (
            <div>
                <p>{t('question.shared.correct')}</p>
                <p>{this.allAllowableAnswers()}</p>
                <ShowVocabSources vocabSources={this.props.question.vocabSources}/>
            </div>
        );
    }

    renderInputField(t: TFunction, fieldValue: 'bestemtEntalValue' | 'ubestemtFlertalValue' | 'bestemtFlertalValue') {
        const field = fieldValue.replace('Value', '');

        // expands to:
        // question.substantiv.given_ubestemt_ental.bestemtEntal.label
        // question.substantiv.given_ubestemt_ental.ubestemtFlertal.label
        // question.substantiv.given_ubestemt_ental.bestemtFlertal.label

        return (
            <tr key={fieldValue}>
                <td>{t(`question.substantiv.given_ubestemt_ental.${field}.label`)}</td>
                <td>
                    <input
                        type="text"
                        size={30}
                        value={this.state[fieldValue]}
                        onChange={(e) => this.handleChange(e, fieldValue)}
                        onBlur={() => this.onBlur(fieldValue)}
                        data-testid={field}
                    />
                </td>
            </tr>
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
                                        data-testid="køn"
                                    />
                                </span>
                            </td>
                        </tr>
                        {this.renderInputField(t, 'bestemtEntalValue')}
                        {this.renderInputField(t, 'ubestemtFlertalValue')}
                        {this.renderInputField(t, 'bestemtFlertalValue')}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withTranslation()(QuestionForm);
