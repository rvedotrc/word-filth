import * as React from 'react';
import { withTranslation } from 'react-i18next';

import ExternalLinker from 'lib/external_linker';
import * as stdq from "../../../shared/standard_form_question";
import GivenInfinitiveQuestion, {VerbData} from "./index";
import {uniqueBy} from "lib/unique-by";

export interface Props extends stdq.Props {
    question: GivenInfinitiveQuestion;
}

export interface State extends stdq.State<Attempt> {
    nutidValue: string;
    datidValue: string;
    førnutidValue: string;
}

export interface Attempt {
    nutid: string;
    datid: string;
    førnutid: string;
}

class QuestionForm extends stdq.QuestionForm<Props, State, Attempt> {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.defaultState(),
            nutidValue: '',
            datidValue: '',
            førnutidValue: '',
        };
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>, field: "nutidValue" | "datidValue" | "førnutidValue") {
        const newState = {...this.state};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    getGivenAnswer() {
        const {t} = this.props;

        if (this.state.nutidValue.trim() === '1') {
            this.autoFill('er', 'ede', 'et');
            return;
        }

        if (this.state.nutidValue.trim() === '2') {
            this.autoFill('er', 'te', 't');
            return;
        }

        const nutid = this.state.nutidValue.trim().toLowerCase();
        const datid = this.state.datidValue.trim().toLowerCase();
        const førnutid = this.state.førnutidValue.trim().toLowerCase();

        if (!(nutid.match(/^\S+$/) && datid.match(/^\S+$/) && førnutid.match(/^\S+$/))) {
            this.showFadingMessage(t('question.builtin_verb.given_infinitive.all_forms_required'));
            return;
        }

        return {nutid, datid, førnutid};
    }

    autoFill(nutid: string, datid: string, førnutid: string) {
        const shortStem = this.props.question.infinitive
            .replace(/^(at|å) /, '')
            .replace(/e$/, '');
        this.setState({
            nutidValue: shortStem + nutid,
            datidValue: shortStem + datid,
            førnutidValue: shortStem + førnutid,
        });
    }

    checkAnswer(givenAnswer: Attempt) {
        return this.props.question.verbs.some(verb => {
            return (verb.nutid.includes(givenAnswer.nutid)
                && verb.datid.includes(givenAnswer.datid)
                && verb.førnutid.includes(givenAnswer.førnutid));
        });
    }

    allGivenAnswers(givenAnswers: Attempt[]): React.ReactFragment {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        const t = givenAnswers
            .map((attempt, index) => <span key={index}>
                {attempt.nutid}, {attempt.datid}, {attempt.førnutid}
            </span>)
            .reduce((prev, curr) => <span>
                {prev}
                <br key="br"/>
                {'så: '}
                {curr}
            </span>);

        return t;
    }

    joinBoldWords(words: string[]): React.ReactFragment {
        if (words.length === 0) return '-';

        // TODO: t complex
        const t = words
            .map((word, index) => <b key={index}>{word}</b>)
            .reduce((prev, curr) => <>{prev}{' eller '}{curr}</>);

        return <span>{t}</span>;
    }

    allAllowableAnswers(): React.ReactFragment {
        const verbs = this.props.question.verbs;
        if (verbs.length === 0) return '-';

        const keyer = (verb: VerbData) => (
            JSON.stringify([verb.nutid, verb.datid, verb.førnutid])
        );

        // TODO: t complex
        const t = uniqueBy(verbs, keyer)
            .map((verb: VerbData, index: number) => {
            return <span key={index}>
                {this.joinBoldWords(verb.nutid)},{' '}
                {this.joinBoldWords(verb.datid)},{' '}
                {this.joinBoldWords(verb.førnutid)}
            </span>
        }).reduce((prev: React.ReactFragment, curr: React.ReactFragment) => <>{prev}{'; eller '}{curr}</>);

        return <span>{t}</span>;
    }

    getfurtherReadingLinks() {
        // TODO: norsk? At the moment the built-in verbs are all Danish.
        const infinitive = this.props.question.infinitive;
        const ddoLink = ExternalLinker.toDDO(infinitive.replace(/^(at|å) /, ''));
        const gtLink = ExternalLinker.toGoogleTranslate(infinitive);

        return { ddoLink, gtLink };
    }

    furtherReadingLinks() {
        const { t } = this.props;
        const { ddoLink, gtLink } = this.getfurtherReadingLinks();

        return (
            <p>
                <a href={ddoLink}>{t('question.builtin_verb.given_infinitive.read_more_at_ddo')}</a>
                <span style={{marginLeft: '0.7em', marginRight: '0.7em'}}>|</span>
                <a href={gtLink}>{t('question.builtin_verb.given_infinitive.translate_with_google')}</a>
            </p>
        );
    }

    renderShowCorrectAnswer(givenAnswers: Attempt[]) {
        const {t} = this.props;

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
                {this.furtherReadingLinks()}
            </div>
        );
    }

    renderPraise() {
        const {t} = this.props;

        return (
            <div>
                <p>{t('question.shared.correct')}</p>
                <p>
                    {this.allAllowableAnswers()}
                </p>
                {this.furtherReadingLinks()}
            </div>
        );
    }

    renderFormHelp() {
        const { t } = this.props;

        return (
            <div>
                <hr/>
                <p>{t('question.builtin_verb.given_infinitive.help_1')}</p>
                <p>{t('question.builtin_verb.given_infinitive.help_2')}</p>
            </div>
        );
    }

    renderQuestionForm() {
        const { t, question } = this.props;
        const verbInfinitive = question.infinitive;
        const { ddoLink, gtLink } = this.getfurtherReadingLinks();

        return (
            <div>
                <p>
                    {t('question.builtin_verb.given_infinitive.question', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        infinitive: <a href={ddoLink}>{verbInfinitive}</a>,
                    })}
                    {this.props.question.engelsk && (
                        <span style={{marginLeft: '0.3em'}}>({this.props.question.engelsk})</span>
                    )}
                    <span style={{marginLeft: '0.75em'}}>
                        <a href={gtLink}>&#x2194;</a>
                    </span>
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{t('question.builtin_verb.given_infinitive.nutid.label')}</td>
                        <td><input
                            value={this.state.nutidValue}
                            size={20}
                            autoFocus={true}
                            data-test-id="nutid"
                            onChange={(e) => this.handleChange(e, 'nutidValue')}
                        /></td>
                    </tr>
                    <tr>
                        <td>{t('question.builtin_verb.given_infinitive.datid.label')}</td>
                        <td><input
                            value={this.state.datidValue}
                            size={20}
                            data-test-id="datid"
                            onChange={(e) => this.handleChange(e, 'datidValue')}
                        /></td>
                    </tr>
                    <tr>
                        <td>{t('question.builtin_verb.given_infinitive.førnutid.label')}</td>
                        <td><input
                            value={this.state.førnutidValue}
                            size={20}
                            data-test-id="førnutid"
                            onChange={(e) => this.handleChange(e, 'førnutidValue')}
                        /></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withTranslation()(QuestionForm);
