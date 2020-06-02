import * as React from 'react';

import TextTidier from '../../shared/text_tidier';
import * as stdq from './standard_form_question';
import {unique} from "../CustomVocab/verbum/GivenInfinitiveQuestion/unique-by";

export interface Props extends stdq.Props{
    lang: string;
    question: string;
    allowableAnswers: string[];
}

export interface State extends stdq.State<Attempt> {
    answerValue: string;
}

export type Attempt = string;

abstract class GivenOneLanguageAnswerTheOther extends stdq.QuestionForm<Props, State, Attempt> {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...(this.state || {}),
            ...this.defaultState(),
            answerValue: '',
        };
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>, field: "answerValue") {
        const newState = {...this.state};
        newState[field] = event.target.value;
        this.setState(newState);
    }

    getGivenAnswer() {
        const givenAnswer = TextTidier.normaliseWhitespace(this.state.answerValue);

        if (givenAnswer === '') {
            return;
        }

        return givenAnswer;
    }

    checkAnswer(attempt: Attempt) {
        return this.props.allowableAnswers.some(allowableAnswer =>
            TextTidier.normaliseWhitespace(allowableAnswer).toLowerCase().replace(/ \[.*\]$/, '') ===
            TextTidier.normaliseWhitespace(attempt).toLowerCase()
        );
    }

    allGivenAnswers(givenAnswers: Attempt[]) {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        const t = givenAnswers
            .map(givenAnswer => <>{givenAnswer}</>)
            .reduce((prev, curr) => <span>{prev}<br key="br"/>{'så: '}{curr}</span>);

        return t;
    }

    allAllowableAnswers() {
        if (this.props.allowableAnswers.length === 0) return '-';

        // TODO: t complex
        const t = unique(this.props.allowableAnswers)
            .sort()
            .map(allowableAnswer => <b>{allowableAnswer}</b>)
            .reduce((prev, curr) => <>{prev}{' eller '}{curr}</>);

        return <span>{t}</span>;
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

    abstract questionPhrase(q: string): React.ReactFragment;
    abstract answerLabel(): string;

    renderQuestionForm() {
        return (
            <div>
                <p>
                    {this.questionPhrase(this.props.question)}
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{this.answerLabel()}</td>
                        <td><input
                            value={this.state.answerValue}
                            size={30}
                            autoFocus={true}
                            onChange={(e) => this.handleChange(e, 'answerValue')}
                        /></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}


// TODO: why no "withTranslation()(...)" here?
export default GivenOneLanguageAnswerTheOther;
