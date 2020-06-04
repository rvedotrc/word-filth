import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import Bøjning from "lib/bøjning";
import TextTidier from 'lib/text_tidier';
import LanguageInput from "@components/shared/language_input";
import AdjektivVocabEntry, {Data} from "./adjektiv_vocab_entry";

interface Props extends WithTranslation {
    dbref: firebase.database.Reference;
    onCancel: () => void;
    onSearch: (text: string) => void;
    vocabLanguage: string;
    editingExistingEntry: AdjektivVocabEntry;
}

interface State {
    editingExistingKey: string;
    vocabLanguage: string;
    grundForm: string;
    bøjning: string;
    tForm: string;
    langForm: string;
    komparativ: string;
    superlativ: string;
    engelsk: string;
    itemToSave: AdjektivVocabEntry;
}

class AddAdjektiv extends React.Component<Props, State> {
    private readonly firstInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        if (props.editingExistingEntry) {
            this.state = this.initialEditState(props.editingExistingEntry);
        } else {
            this.state = this.initialEmptyState();
        }

        this.props.onSearch(this.state.grundForm);
        this.firstInputRef = React.createRef();
    }

    initialEmptyState(): State {
        return {
            editingExistingKey: null,
            vocabLanguage: this.props.vocabLanguage,
            grundForm: '',
            bøjning: '',
            tForm: '',
            langForm: '',
            komparativ: '',
            superlativ: '',
            engelsk: '',
            itemToSave: null,
        };
    }

    initialEditState(entry: AdjektivVocabEntry) {
        return  {
            editingExistingKey: entry.vocabKey,
            vocabLanguage: entry.lang,
            grundForm: entry.grundForm,
            bøjning: '',
            tForm: entry.tForm,
            langForm: entry.langForm,
            komparativ: entry.komparativ,
            superlativ: entry.superlativ,
            engelsk: entry.engelsk,
            itemToSave: entry,
        }
    }

    itemToSave(state: State): AdjektivVocabEntry {
        if (!(
            state.grundForm !== ''
            && state.tForm !== ''
            && state.langForm !== ''
            && ((state.komparativ === '') === (state.superlativ === ''))
        )) return null;

        const tidyLowerCase = (s: string) => TextTidier.normaliseWhitespace(s).toLowerCase();

        const item: Data = {
            lang: state.vocabLanguage,
            grundForm: tidyLowerCase(state.grundForm),
            tForm: tidyLowerCase(state.tForm),
            langForm: tidyLowerCase(state.langForm),
            komparativ: tidyLowerCase(state.komparativ) || null,
            superlativ: tidyLowerCase(state.superlativ) || null,
            // no toLowerCase
            engelsk: TextTidier.normaliseWhitespace(state.engelsk) || null,
        };

        return new AdjektivVocabEntry(
            state.editingExistingKey,
            item,
        );
    }

    handleChange(newValue: string, field: "vocabLanguage" | "grundForm" | "bøjning" | "tForm" | "langForm" | "komparativ" | "superlativ" | "engelsk") {
        const newState: State = { ...this.state };
        newState[field] = newValue;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
        this.props.onSearch(newState.grundForm);
    }

    handleBøjning(e: React.ChangeEvent<HTMLInputElement>) {
        let newState: State = { ...this.state };

        const bøjning = e.target.value.toLowerCase(); // no trim
        newState.bøjning = bøjning;

        const result = new Bøjning().expandAdjektiv(
            TextTidier.normaliseWhitespace(this.state.grundForm),
            TextTidier.normaliseWhitespace(bøjning),
        );

        if (result) {
            newState = { ...newState, ...result };
        }

        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    onSubmit() {
        const { itemToSave } = this.state;
        if (!itemToSave) return;

        const newRef = (
            this.state.editingExistingKey
            ? this.props.dbref.child(this.state.editingExistingKey)
            : this.props.dbref.push()
        );

        const data = {
            type: itemToSave.type,
            ...itemToSave.encode(),
        };

        newRef.set(data).then(() => {
            this.setState(this.initialEmptyState());
            this.props.onSearch('');
            this.firstInputRef.current.focus();
        });
    }

    onDelete() {
        if (!window.confirm(this.props.t('my_vocab.delete.confirmation.this'))) return;

        this.props.dbref.child(this.state.editingExistingKey)
            .remove().then(() => {
                this.props.onCancel();
            });
    }

    render() {
        const { t } = this.props;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onSubmit(); }}
                onReset={this.props.onCancel}
            >
                <h2>{t('my_vocab.add_adjective.heading')}</h2>

                <p>{t('my_vocab.add_adjective.help_1')}</p>
                <p>{t('my_vocab.add_adjective.help_2')}</p>
                <p>{t('my_vocab.add_adjective.help_3')}</p>
                <p>{t('my_vocab.add_adjective.help_4')}</p>

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
                            <td>{t('my_vocab.add_adjective.grund_form.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.grundForm}
                                    onChange={e => this.handleChange(e.target.value, 'grundForm')}
                                    autoFocus={true}
                                    ref={this.firstInputRef}
                                    data-test-id="grundForm"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_adjective.inflection.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.bøjning}
                                    onChange={e => this.handleBøjning(e)}
                                    data-test-id="bøjning"
                                />
                                {' '}
                                <i>{t('my_vocab.add_adjective.inflection.example')}</i>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_adjective.t_form.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.tForm}
                                    onChange={e => this.handleChange(e.target.value, 'tForm')}
                                    data-test-id="tForm"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_adjective.lang_form.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.langForm}
                                    onChange={e => this.handleChange(e.target.value, 'langForm')}
                                    data-test-id="langForm"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_adjective.komparativ.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.komparativ}
                                    onChange={e => this.handleChange(e.target.value, 'komparativ')}
                                    data-test-id="komparativ"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_adjective.superlativ.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.superlativ}
                                    onChange={e => this.handleChange(e.target.value, 'superlativ')}
                                    data-test-id="superlativ"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('question.shared.label.english')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
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
                        ? "" + t('my_vocab.shared.update.button')
                        : "" + t('my_vocab.shared.add.button')
                    } disabled={!this.state.itemToSave}/>
                    <input type="reset" value={"" + t('my_vocab.shared.cancel.button')}/>
                    {this.state.editingExistingKey && (
                        <input type="button"
                               className="danger"
                               value={"" + t('my_vocab.delete.action.button')}
                               onClick={() => this.onDelete()}
                        />
                    )}
                </p>
            </form>
        )
    }
}

export default withTranslation()(AddAdjektiv);
