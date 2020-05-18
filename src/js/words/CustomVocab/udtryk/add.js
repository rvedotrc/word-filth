import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import TextTidier from '../../../shared/text_tidier';
import LanguageInput from "../../../components/shared/language_input";

class AddPhrase extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState(this.props.editingExistingKey, this.props.editingExistingData);
        this.props.onSearch(this.state.dansk);
        this.firstInputRef = React.createRef();
    }

    initialState(key, data) {
        const s = {
            editingExistingKey: key,
            vocabLanguage: (data && data.lang) || this.props.vocabLanguage,
            dansk: (data && data.dansk ) || '',
            engelsk: (data && data.engelsk) || '',
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state) {
        // no toLowerCase
        const dansk = TextTidier.normaliseWhitespace(state.dansk);
        const engelsk = TextTidier.normaliseWhitespace(state.engelsk);
        if (!(
            dansk !== ''
            && engelsk !== ''
        )) return null;

        const item = {
            lang: state.vocabLanguage,
            type: 'udtryk',
            dansk,
            engelsk,
        };

        return item;
    }

    handleChange(newValue, field) {
        const newState = this.state;
        newState[field] = newValue;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
        this.props.onSearch(newState.dansk);
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
                <h2>{t('my_vocab.add_phrase.heading')}</h2>

                <p>{t('my_vocab.add_phrase.help')}</p>

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
                            <td>{t('question.shared.label.danish')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.dansk}
                                    onChange={e => this.handleChange(e.target.value, 'dansk')}
                                    autoFocus="yes"
                                    ref={this.firstInputRef}
                                    data-test-id="dansk"
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

AddPhrase.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    vocabLanguage: PropTypes.string.isRequired,
    editingExistingKey: PropTypes.string,
    editingExistingData: PropTypes.object,
};

export default withTranslation()(AddPhrase);
