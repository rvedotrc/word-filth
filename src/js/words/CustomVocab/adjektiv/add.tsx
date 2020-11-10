import * as React from 'react';
import {withTranslation} from 'react-i18next';

import TextTidier from 'lib/text_tidier';
import * as VocabLanguage from "lib/vocab_language";
import VocabLanguageInput from "@components/shared/vocab_language_input";
import AdjektivVocabEntry, {Data} from "./adjektiv_vocab_entry";
import {AdderProps} from "lib/types/question";
import {bøj, expandAdjektiv} from "lib/bøjning";

type Props = AdderProps;

type State = {
    vocabKey: string;
    editingExistingKey: boolean;
    vocabLanguage: VocabLanguage.Type;
    grundForm: string;
    bøjning: string;
    tForm: string;
    langForm: string;
    komparativ: string;
    superlativ: string;
    engelsk: string;
    tags: string;
    itemToSave: AdjektivVocabEntry | undefined;
}

class AddAdjektiv extends React.Component<Props, State> {
    private readonly firstInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        if (props.editingExistingEntry) {
            this.state = this.initialEditState(props.editingExistingEntry as AdjektivVocabEntry);
        } else {
            this.state = this.initialEmptyState();
        }

        this.props.onSearch(this.state.grundForm);
        this.firstInputRef = React.createRef();
    }

    initialEmptyState(): State {
        return {
            vocabKey: this.props.dbref.push().key as string,
            editingExistingKey: false,
            vocabLanguage: this.props.vocabLanguage,
            grundForm: '',
            bøjning: '',
            tForm: '',
            langForm: '',
            komparativ: '',
            superlativ: '',
            engelsk: '',
            tags: this.state?.tags || '',
            itemToSave: undefined,
        };
    }

    initialEditState(entry: AdjektivVocabEntry) {
        return  {
            vocabKey: entry.vocabKey,
            editingExistingKey: true,
            vocabLanguage: entry.struct.lang,
            grundForm: entry.struct.grundForm,
            bøjning: '',
            tForm: entry.struct.tForm,
            langForm: entry.struct.langForm,
            komparativ: entry.struct.komparativ || "",
            superlativ: entry.struct.superlativ || "",
            engelsk: entry.struct.engelsk || "",
            tags: (entry.struct.tags || []).join(" "),
            itemToSave: entry,
        }
    }

    itemToSave(state: State): AdjektivVocabEntry | undefined {
        const tidyLowerCase = (s: string) => TextTidier.normaliseWhitespace(s).toLowerCase();

        const grundForm = tidyLowerCase(state.grundForm) || null;
        const tForm = tidyLowerCase(state.tForm) || null;
        const langForm = tidyLowerCase(state.langForm) || null;
        const komparativ = tidyLowerCase(state.komparativ) || null;
        const superlativ = tidyLowerCase(state.superlativ) || null;
        // no toLowerCase
        const engelsk = TextTidier.normaliseWhitespace(state.engelsk) || null;
        const tags = TextTidier.parseTags(state.tags);

        if (!grundForm || !tForm || !langForm) return undefined;
        if (!!komparativ !== !!superlativ) return undefined;

        const data: Data = {
            lang: state.vocabLanguage,
            grundForm,
            tForm,
            langForm,
            komparativ,
            superlativ,
            engelsk,
            tags,
        };

        return new AdjektivVocabEntry(
            state.vocabKey,
            data,
        );
    }

    handleVocabLanguage(newValue: VocabLanguage.Type) {
        const newState: State = { ...this.state };
        newState.vocabLanguage = newValue;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
        this.props.onSearch(newState.grundForm);
    }

    handleChange(newValue: string, field: "grundForm" | "bøjning" | "tForm" | "langForm" | "komparativ" | "superlativ" | "engelsk" | "tags") {
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

        const result = expandAdjektiv(
            TextTidier.normaliseWhitespace(this.state.grundForm),
            TextTidier.normaliseWhitespace(bøjning),
        );

        if (result) {
            newState = { ...newState, ...result };
        }

        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    onBlur(field: "tForm" | "langForm" | "komparativ" | "superlativ") {
        this.setState((prevState: State) => {
            const expanded = bøj(this.state.grundForm, prevState[field]);
            const newState = {...prevState};
            newState[field] = expanded;
            return newState;
        });
    }

    onSubmit() {
        const { itemToSave } = this.state;
        if (!itemToSave) return;

        const newRef = this.props.dbref.child(itemToSave.vocabKey);

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

        this.props.dbref.child(this.state.vocabKey)
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
                <h1>{t('my_vocab.add_adjective.heading')}</h1>

                <div className={"help"}>
                    <p>{t('my_vocab.add_adjective.help_1')}</p>
                    <p>{t('my_vocab.add_adjective.help_2')}</p>
                    <p>{t('my_vocab.add_adjective.help_3')}</p>
                    <p>{t('my_vocab.add_adjective.help_4')}</p>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <td>{t('my_vocab.shared.language.label')}</td>
                            <td>
                                <VocabLanguageInput
                                    autoFocus={false}
                                    data-testid={"vocabulary-language"}
                                    onChange={lang => this.handleVocabLanguage(lang)}
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
                                    lang={this.state.vocabLanguage}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
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
                                    lang={this.state.vocabLanguage}
                                    spellCheck={false}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
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
                                    lang={this.state.vocabLanguage}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={this.state.tForm}
                                    onChange={e => this.handleChange(e.target.value, 'tForm')}
                                    onBlur={() => this.onBlur('tForm')}
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
                                    lang={this.state.vocabLanguage}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={this.state.langForm}
                                    onChange={e => this.handleChange(e.target.value, 'langForm')}
                                    onBlur={() => this.onBlur('langForm')}
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
                                    lang={this.state.vocabLanguage}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={this.state.komparativ}
                                    onChange={e => this.handleChange(e.target.value, 'komparativ')}
                                    onBlur={() => this.onBlur('komparativ')}
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
                                    lang={this.state.vocabLanguage}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={this.state.superlativ}
                                    onChange={e => this.handleChange(e.target.value, 'superlativ')}
                                    onBlur={() => this.onBlur('superlativ')}
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
                                    lang={"en"}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={this.state.engelsk}
                                    onChange={e => this.handleChange(e.target.value, 'engelsk')}
                                    data-testid="engelsk"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('question.shared.label.tags')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={this.state.tags}
                                    onChange={e => this.handleChange(e.target.value, 'tags')}
                                    data-testid="tags"
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
