import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import ExternalLinker from '../../../shared/external_linker';
import * as stdq from "../../shared/standard_form_question";

class QuestionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...stdq.defaultState(),
            nutidValue: '',
            datidValue: '',
            førnutidValue: '',
        };
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    getGivenAnswer() {
        const {t} = this.props;

        if (this.state.nutidValue.trim() === '1') {
            this.autoFill('er', 'ede', 'et');
            return false;
        }

        if (this.state.nutidValue.trim() === '2') {
            this.autoFill('er', 'te', 't');
            return false;
        }

        const nutid = this.state.nutidValue.trim().toLowerCase();
        const datid = this.state.datidValue.trim().toLowerCase();
        const førnutid = this.state.førnutidValue.trim().toLowerCase();

        if (!(nutid.match(/^\S+$/) && datid.match(/^\S+$/) && førnutid.match(/^\S+$/))) {
            this.showFadingMessage(t('question.builtin_verb.given_infinitive.all_forms_required'));
            return false;
        }

        return {nutid, datid, førnutid};
    }

    autoFill(nutid, datid, førnutid) {
        const shortStem = this.props.question.infinitive
            .replace(/^(at|å) /, '')
            .replace(/e$/, '');
        this.setState({
            nutidValue: shortStem + nutid,
            datidValue: shortStem + datid,
            førnutidValue: shortStem + førnutid,
        });
    }

    checkAnswer(givenAnswer) {
        return this.props.question.verbs.some(verb => {
            return (verb.nutid.includes(givenAnswer.nutid)
                && verb.datid.includes(givenAnswer.datid)
                && verb.førnutid.includes(givenAnswer.førnutid));
        });
    }

    allGivenAnswers(givenAnswers) {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        return givenAnswers
            .map((attempt, index) => <span key={index}>
                {attempt.nutid}, {attempt.datid}, {attempt.førnutid}
            </span>)
            .reduce((prev, curr) => [prev, <br key="br"/>, 'så: ', curr])
    }

    joinBoldWords(words) {
        if (words.length === 0) return '-';

        // TODO: t complex
        return words
            .map((word, index) => <b key={index}>{word}</b>)
            .reduce((prev, curr) => [prev, ' eller ', curr]);
    }

    allAllowableAnswers() {
        const verbs = this.props.question.verbs;
        if (verbs.length === 0) return '-';

        // TODO: t complex
        return verbs.map((verb, index) => {
            return <span key={index}>
                {this.joinBoldWords(verb.nutid)},{' '}
                {this.joinBoldWords(verb.datid)},{' '}
                {this.joinBoldWords(verb.førnutid)}
            </span>
        }).reduce((prev, curr) => [prev, '; eller ', curr]);
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

    renderShowCorrectAnswer(givenAnswers) {
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
                        infinitive: <a key="ddoLink" href={ddoLink}>{verbInfinitive}</a>,
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
                            size="20"
                            autoFocus="yes"
                            data-test-id="nutid"
                            onChange={(e) => this.handleChange(e, 'nutidValue')}
                        /></td>
                    </tr>
                    <tr>
                        <td>{t('question.builtin_verb.given_infinitive.datid.label')}</td>
                        <td><input
                            value={this.state.datidValue}
                            size="20"
                            data-test-id="datid"
                            onChange={(e) => this.handleChange(e, 'datidValue')}
                        /></td>
                    </tr>
                    <tr>
                        <td>{t('question.builtin_verb.given_infinitive.førnutid.label')}</td>
                        <td><input
                            value={this.state.førnutidValue}
                            size="20"
                            data-test-id="førnutid"
                            onChange={(e) => this.handleChange(e, 'førnutidValue')}
                        /></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    onAnswer() { return stdq.onAnswer.call(this) }
    onGiveUp() { return stdq.onGiveUp.call(this) }
    showFadingMessage() { return stdq.showFadingMessage.call(this, ...arguments) }
    render() { return stdq.render.call(this) }
}

QuestionForm.propTypes = {
    ...stdq.propTypes,
    question: PropTypes.object.isRequired,
};

export default withTranslation()(QuestionForm);
