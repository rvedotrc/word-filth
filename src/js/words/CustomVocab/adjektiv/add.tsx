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
    editingExistingKey: string | null;
    vocabLanguage: string;
    grundForm: string;
    bøjning: string;
    tForm: string;
    langForm: string;
    komparativ: string;
    superlativ: string;
    engelsk: string;
    itemToSave: AdjektivVocabEntry | undefined;
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
            itemToSave: undefined,
        };
    }

    initialEditState(entry: AdjektivVocabEntry) {
        return  {
            editingExistingKey: entry.vocabKey,
            vocabLanguage: entry.struct.lang,
            grundForm: entry.struct.grundForm,
            bøjning: '',
            tForm: entry.struct.tForm,
            langForm: entry.struct.langForm,
            komparativ: entry.struct.komparativ || "",
            superlativ: entry.struct.superlativ || "",
            engelsk: entry.struct.engelsk || "",
            itemToSave: entry,
        }
    }

    itemToSave(state: State): AdjektivVocabEntry | undefined {
        const tidyLowerCase = (s: string) => TextTidier.normaliseWhitespace(s).toLowerCase();

        const grundForm = tidyLowerCase(state.grundForm) || undefined;
        const tForm = tidyLowerCase(state.tForm) || undefined;
        const langForm = tidyLowerCase(state.langForm) || undefined;
        const komparativ = tidyLowerCase(state.komparativ) || undefined;
        const superlativ = tidyLowerCase(state.superlativ) || undefined;
        // no toLowerCase
        const engelsk = TextTidier.normaliseWhitespace(state.engelsk) || undefined;

        if (!grundForm || !tForm || !langForm) return undefined;

        const base = {
            lang: state.vocabLanguage,
            grundForm,
            tForm,
            langForm,
            engelsk,
        };

        const data: Data | null = (
            (komparativ && superlativ) ? {...base, komparativ, superlativ}
            : (!komparativ && !superlativ) ? {...base, komparativ: undefined, superlativ: undefined}
            : null
        );
        if (!data) return undefined;

        return new AdjektivVocabEntry(
            state.editingExistingKey,
            data,
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
            this.props.onSearch('');
            if (this.state.editingExistingKey) {
                this.props.onCancel();
            } else {
                this.setState(this.initialEmptyState());
                this.firstInputRef.current?.focus();
            }
        });
    }

    onDelete() {
        if (!window.confirm(this.props.t('my_vocab.delete.confirmation.this'))) return;
        if (!this.state.editingExistingKey) return;

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
                                    data-testid={"vocabulary-language"}
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
                                    data-testid="grundForm"
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
                                    data-testid="bøjning"
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
                                    data-testid="tForm"
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
                                    data-testid="langForm"
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
                                    data-testid="komparativ"
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
                                    data-testid="superlativ"
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
                                    data-testid="engelsk"
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
