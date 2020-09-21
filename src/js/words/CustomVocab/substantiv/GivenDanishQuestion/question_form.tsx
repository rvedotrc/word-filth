import * as React from 'react';
import { withTranslation } from 'react-i18next';

import * as stdq from "../../../shared/standard_form_question";
import {unique} from "lib/unique-by";
import GivenDanishQuestion from "./index";
import TextTidier from "lib/text_tidier";
import ShowVocabSources from "../../../shared/show_vocab_sources";

export type Props = {
    question: GivenDanishQuestion;
} & stdq.Props

export type State = {
    engelsk: string;
} & stdq.State<Attempt>

export type Attempt = {
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

    handleChange(event: React.ChangeEvent<HTMLInputElement>, field: "engelsk") {
        const newState = {...this.state};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    getGivenAnswer() {
        const engelsk = this.state.engelsk.trim().toLowerCase();

        if (engelsk === '') {
            return undefined;
        }

        return { engelsk };
    }

    checkAnswer(attempt: Attempt) {
        const stripArticle = (t: string) => t.replace(/^an? /, '');

        return this.props.question.answers.some(
            allowable => stripArticle(
                attempt.engelsk.toLowerCase()
            ) === stripArticle(
                TextTidier.discardComments(
                    allowable.engelsk.toLowerCase()
                )
            )
        );
    }

    allGivenAnswers(givenAnswers: Attempt[]): React.ReactFragment {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        return givenAnswers
            .map(givenAnswer => givenAnswer.engelsk as React.ReactFragment)
            .reduce((prev, curr) => <span>{prev}<br key="br"/>{'så: '}{curr}</span>);
    }

    allAllowableAnswers(): React.ReactFragment {
        if (this.props.question.answers.length === 0) return '-';

        // TODO: t complex
        const t = unique(
                (this.props.question.answers as Attempt[])
                    .map(answer => answer.engelsk)
            )
            .sort()
            .map((answer: React.ReactFragment, index: number) => <b key={index}>{answer}</b>)
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
                                data-testid="answer"
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
