import * as React from 'react';
import { withTranslation } from 'react-i18next';

import ExternalLinker from 'lib/external_linker';
import * as stdq from "../../../shared/standard_form_question";
import GivenInfinitiveQuestion, {VerbData} from "./index";
import {uniqueBy} from "lib/unique-by";
import ShowVocabSources from "../../../shared/show_vocab_sources";
import {bøj, expandVerbum} from "lib/bøjning";

export type Props = {
    question: GivenInfinitiveQuestion;
} & stdq.Props

export type State = {
    nutidValue: string;
    datidValue: string;
    førnutidValue: string;
} & stdq.State<Attempt>

export type Attempt = {
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

    onBlur(field: "nutidValue" | "datidValue" | "førnutidValue") {
        this.setState(this.expandField(field, this.state));
    }

    expandField(field: "nutidValue" | "datidValue" | "førnutidValue", state: State): State {
        if (field === 'nutidValue') {
            const result = expandVerbum(
                this.props.question.infinitive,
                state.nutidValue
            );

            if (result) {
                return {
                    ...state,
                    nutidValue: result.nutid,
                    datidValue: result.datid,
                    førnutidValue: result.førnutid,
                };
            }
        }

        const stem = this.props.question.infinitive
            .replace(/^(at|å) /, '');
        const expanded = bøj(stem, state[field]);
        const newState: State = {...state};
        newState[field] = expanded;
        return newState;
    }

    getGivenAnswer() {
        const {t} = this.props;
        let state = this.state;
        const stateBefore = state;

        state = this.expandField("nutidValue", state);
        state = this.expandField("datidValue", state);
        state = this.expandField("førnutidValue", state);
        this.setState(state);

        if (state.nutidValue !== stateBefore.nutidValue) return false;
        if (state.datidValue !== stateBefore.datidValue) return false;
        if (state.førnutidValue !== stateBefore.førnutidValue) return false;

        // Maybe reintroducing https://github.com/rvedotrc/word-filth/issues/20 here?
        const nutid = state.nutidValue.trim().toLowerCase();
        const datid = state.datidValue.trim().toLowerCase();
        const førnutid = state.førnutidValue.trim().toLowerCase();

        if (!(nutid.match(/^\S+$/) && datid.match(/^\S+$/) && førnutid.match(/^\S+$/))) {
            this.showFadingMessage(t('question.builtin_verb.given_infinitive.all_forms_required'));
            return false;
        }

        return {nutid, datid, førnutid};
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
        return givenAnswers
            .map((attempt, index) => <span key={index}>
                {attempt.nutid}, {attempt.datid}, {attempt.førnutid}
            </span>)
            .reduce((prev, curr) => <span>
                {prev}
                <br key="br"/>
                {'så: '}
                {curr}
            </span>);
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
                <ShowVocabSources vocabSources={this.props.question.vocabSources}/>
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
                <ShowVocabSources vocabSources={this.props.question.vocabSources}/>
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
                            data-testid="nutid"
                            onChange={(e) => this.handleChange(e, 'nutidValue')}
                            onBlur={() => this.onBlur('nutidValue')}
                        /></td>
                    </tr>
                    <tr>
                        <td>{t('question.builtin_verb.given_infinitive.datid.label')}</td>
                        <td><input
                            value={this.state.datidValue}
                            size={20}
                            data-testid="datid"
                            onChange={(e) => this.handleChange(e, 'datidValue')}
                            onBlur={() => this.onBlur('datidValue')}
                        /></td>
                    </tr>
                    <tr>
                        <td>{t('question.builtin_verb.given_infinitive.førnutid.label')}</td>
                        <td><input
                            value={this.state.førnutidValue}
                            size={20}
                            data-testid="førnutid"
                            onChange={(e) => this.handleChange(e, 'førnutidValue')}
                            onBlur={() => this.onBlur('førnutidValue')}
                        /></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withTranslation()(QuestionForm);
