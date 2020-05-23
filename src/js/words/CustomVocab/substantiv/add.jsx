import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Bøjning from "../../../shared/bøjning";
import TextTidier from '../../../shared/text_tidier';
import GenderInput from "../../../components/shared/gender_input";
import LanguageInput from "../../../components/shared/language_input";

class AddNoun extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState(this.props.editingExistingKey, this.props.editingExistingData);
        this.props.onSearch(this.state.ubestemtEntal); // TODO: or other forms?
        this.firstInputRef = React.createRef();
    }

    initialState(key, data) {
        const s = {
            editingExistingKey: key,
            vocabLanguage: (data && data.lang) || this.props.vocabLanguage,
            køn: (data && data.køn) || null,
            ubestemtEntal: (data && data.ubestemtEntal) || '',
            bøjning: '',
            ubestemtFlertal: (data && data.ubestemtFlertal) || '',
            bestemtEntal: (data && data.bestemtEntal) || '',
            bestemtFlertal: (data && data.bestemtFlertal) || '',
            engelsk: (data && data.engelsk) || '',
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state) {
        const tidyLowerCase = (s) => TextTidier.normaliseWhitespace(s).toLowerCase();

        const item = {
            lang: state.vocabLanguage,
            type: 'substantiv',
            køn: state.køn,
        };

        if (item.køn !== 'en' && item.køn !== 'et' && item.køn !== 'pluralis') return;

        let hasForm = false;
        ['ubestemtEntal', 'bestemtEntal', 'ubestemtFlertal', 'bestemtFlertal'].map(key => {
            const t = tidyLowerCase(state[key]);
            if (t !== '') {
                item[key] = t;
                hasForm = true;
            }
        });
        if (!hasForm) return;

        const t = TextTidier.normaliseWhitespace(state.engelsk);
        item.engelsk = t;
        if (item.engelsk === '') return;

        return item;
    }

    handleChange(newValue, field) {
        const newState = this.state;
        newState[field] = newValue;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
        this.props.onSearch(newState.ubestemtEntal); // TODO: or other forms?
    }

    handleBøjning(e) {
        // FIXME: are there cases where we're modifying this.state in place?
        const { ubestemtEntal } = this.state;
        const bøjning = e.target.value.toLowerCase();
        this.setState({ bøjning });

        const result = new Bøjning().expandSubstantiv(
            TextTidier.normaliseWhitespace(ubestemtEntal),
            TextTidier.normaliseWhitespace(bøjning),
        );
        if (result) this.setState(result);
    }

    onSubmit() {
        const { itemToSave } = this.state;
        if (!itemToSave) return;

        const newRef = (
            this.state.editingExistingKey
            ? this.props.dbref.child(this.state.editingExistingKey)
            : this.props.dbref.push()
        );

        newRef.set(itemToSave).then(() => {
            this.setState(this.initialState());
            this.props.onSearch();
            this.firstInputRef.current.focus();
        });
    }

    render() {
        const { t } = this.props;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onSubmit(); }}
                onReset={this.props.onCancel}
            >
                <h2>{t('my_vocab.add_noun.heading')}</h2>

                <p>{t('my_vocab.add_noun.help_1')}</p>
                <p>{t('my_vocab.add_noun.help_2')}</p>

                <table>
                    <tbody>
                        <tr>
                            <td>{t('my_vocab.shared.language.label')}</td>
                            <td>
                                <LanguageInput
                                    key={new Date().toString()} // FIXME: Why is this needed?
                                    autoFocus={false}
                                    data-test-id={"vocabulary-language"}
                                    onChange={lang => this.handleChange(lang, 'vocabLanguage')}
                                    allowedValues={['da', 'no']} // FIXME: share this
                                    value={this.state.vocabLanguage}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.gender.label')}</td>
                            <td>
                                <GenderInput
                                    value={this.state.køn}
                                    onChange={v => this.handleChange(v, 'køn')}
                                    autoFocus="yes"
                                    data-test-id="køn"
                                    inputRef={this.firstInputRef}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.indefinite_singular.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.ubestemtEntal}
                                    onChange={e => this.handleChange(e.target.value, 'ubestemtEntal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.inflection.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bøjning}
                                    onChange={(e) => this.handleBøjning(e)}
                                />
                                {' '}
                                <i>{t('my_vocab.add_noun.inflection.example')}</i>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.definite_singular.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bestemtEntal}
                                    onChange={e => this.handleChange(e.target.value, 'bestemtEntal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.indefinite_plural.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.ubestemtFlertal}
                                    onChange={e => this.handleChange(e.target.value, 'ubestemtFlertal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.definite_plural.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bestemtFlertal}
                                    onChange={e => this.handleChange(e.target.value, 'bestemtFlertal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('question.shared.label.english')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.engelsk}
                                    onChange={e => this.handleChange(e.target.value, 'engelsk')}
                                    data-test-id="engelsk"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    <input type="submit" value={
                        this.state.editingExistingKey
                        ? t('my_vocab.shared.update.button')
                        : t('my_vocab.shared.add.button')
                    } disabled={!this.state.itemToSave}/>
                    <input type="reset" value={t('my_vocab.shared.cancel.button')}/>
                </p>
            </form>
        )
    }
}

AddNoun.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    vocabLanguage: PropTypes.string.isRequired,
    editingExistingKey: PropTypes.string,
    editingExistingData: PropTypes.object,
};

export default withTranslation()(AddNoun);
