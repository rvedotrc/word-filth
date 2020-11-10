import * as React from 'react';
import {withTranslation} from 'react-i18next';

import TextTidier from 'lib/text_tidier';
import * as VocabLanguage from "lib/vocab_language";
import VocabLanguageInput from "@components/shared/vocab_language_input";
import VerbumVocabEntry, {Data} from "./verbum_vocab_entry";
import {AdderProps} from "lib/types/question";
import {bøj, expandVerbum} from "lib/bøjning";
import {addParticle, removeParticle} from "lib/particle";

type Props = AdderProps;

type State = {
    vocabKey: string;
    existingEntry: VerbumVocabEntry | null;
    vocabLanguage: VocabLanguage.Type;
    infinitiv: string;
    bøjning: string;
    nutid: string;
    datid: string;
    førnutid: string;
    engelsk: string;
    tags: string;
    itemToSave: VerbumVocabEntry | undefined;
}

class AddVerbum extends React.Component<Props, State> {
    private readonly firstInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        if (props.editingExistingEntry) {
            this.state = this.initialEditState(props.editingExistingEntry as VerbumVocabEntry);
        } else {
            this.state = this.initialEmptyState();
        }

        this.props.onSearch(this.state.infinitiv);
        this.firstInputRef = React.createRef();
    }

    initialEmptyState(): State {
        return {
            vocabKey: this.props.dbref.push().key as string,
            existingEntry: null,
            vocabLanguage: this.props.vocabLanguage,
            infinitiv: '',
            bøjning: '',
            nutid: '',
            datid: '',
            førnutid: '',
            engelsk: '',
            tags: this.state?.tags || '',
            itemToSave: undefined,
        };
    }

    initialEditState(entry: VerbumVocabEntry) {
        const state: State = {
            vocabKey: (
                entry.readOnly
                    ? (this.props.dbref.push().key as string)
                    : entry.vocabKey
            ),
            existingEntry: entry,
            vocabLanguage: entry.lang,
            infinitiv: removeParticle(entry.lang, entry.infinitiv),
            bøjning: '',
            nutid: entry.nutid.join("; "),
            datid: entry.datid.join("; "),
            førnutid: entry.førnutid.join("; "),
            engelsk: entry.engelsk || '',
            tags: (entry.tags || []).join(" "),
            itemToSave: undefined,
        };

        state.itemToSave = this.itemToSave(state);

        return state;
    }

    itemToSave(state: State): VerbumVocabEntry | undefined {
        const tidyLowerCase = (s: string) => TextTidier.normaliseWhitespace(s.toLowerCase());
        const tidyMultiLowerCase = (s: string) => TextTidier.toMultiValue(s.toLowerCase());

        const item: Data = {
            lang: state.vocabLanguage,
            infinitiv: addParticle(state.vocabLanguage, tidyLowerCase(state.infinitiv)),
            nutid: tidyMultiLowerCase(state.nutid),
            datid: tidyMultiLowerCase(state.datid),
            førnutid: tidyMultiLowerCase(state.førnutid),
            engelsk: null,
            tags: TextTidier.parseTags(state.tags),
            hidesVocabKey: (
                state.existingEntry?.readOnly
                ? state.existingEntry.vocabKey
                : null
            ),
        };

        // TODO: particle
        if (!(item.infinitiv.match(/^(at|å) [a-zæøå]+$/))) return;
        if (!(item.nutid.every(t => t.match(/^[a-zæøå]+$/)))) return;
        if (!(item.datid.every(t => t.match(/^[a-zæøå]+$/)))) return;
        if (!(item.førnutid.every(t => t.match(/^[a-zæøå]+$/)))) return;

        // no toLowerCase
        let engelsk = TextTidier.normaliseWhitespace(state.engelsk);
        if (engelsk !== '') {
          if (!(engelsk.startsWith('to '))) engelsk = 'to ' + engelsk;
          item.engelsk = engelsk;
        }

        return new VerbumVocabEntry(
            state.vocabKey,
            false,
            item,
        );
    }

    handleVocabLanguage(newValue: VocabLanguage.Type) {
        const newState = { ...this.state };
        newState.vocabLanguage = newValue;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
        this.props.onSearch(newState.infinitiv);
    }

    handleChange(newValue: string, field: "infinitiv" | "bøjning" | "nutid" | "datid" | "førnutid" | "engelsk" | "tags") {
        const newState = { ...this.state };
        newState[field] = newValue;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
        this.props.onSearch(newState.infinitiv);
    }

    handleBøjning(e: React.ChangeEvent<HTMLInputElement>) {
        let newState: State = { ...this.state };

        const infinitiv = removeParticle(
            this.state.vocabLanguage,
            TextTidier.normaliseWhitespace(this.state.infinitiv)
        );

        const bøjning = e.target.value.toLowerCase(); // no trim
        newState.bøjning = bøjning;

        const result = expandVerbum(
            this.state.vocabLanguage,
            infinitiv,
            TextTidier.normaliseWhitespace(bøjning),
        );

        if (result) {
            newState = { ...newState, ...result };
        }

        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    onBlur(field: "nutid" | "datid" | "førnutid") {
        this.setState((prevState: State) => {
            const stem = removeParticle(this.state.vocabLanguage, this.state.infinitiv);
            const expanded = bøj(stem, prevState[field]);
            const newState: State = {...prevState};
            newState[field] = expanded;
            newState.itemToSave = this.itemToSave(newState);
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
            if (this.state.existingEntry) {
                this.props.onCancel();
            } else {
                this.setState(this.initialEmptyState());
                this.firstInputRef.current?.focus();
            }
        });
    }

    onDelete() {
        if (!window.confirm(this.props.t('my_vocab.delete.confirmation.this'))) return;
        if (!this.state.existingEntry || this.state.existingEntry?.readOnly) return;

        this.props.dbref.child(this.state.existingEntry.vocabKey)
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
                <h1>{t('my_vocab.add_verb.heading')}</h1>

                <div className={"help"}>
                    <p>{t('my_vocab.add_verb.help_1')}</p>
                    <p>{t('my_vocab.add_verb.help_2')}</p>
                    <p>{t('my_vocab.add_verb.help_3')}</p>
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
                            <td>{t('my_vocab.add_verb.infinitive.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    lang={this.state.vocabLanguage}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={this.state.infinitiv}
                                    onChange={e => this.handleChange(e.target.value, 'infinitiv')}
                                    autoFocus={true}
                                    ref={this.firstInputRef}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.inflection.label')}</td>
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
                                    onChange={(e) => this.handleBøjning(e)}
                                />
                                {' '}
                                <i>{t('my_vocab.add_verb.inflection.example')}</i>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.nutid.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    lang={this.state.vocabLanguage}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={this.state.nutid}
                                    onChange={e => this.handleChange(e.target.value, 'nutid')}
                                    onBlur={() => this.onBlur('nutid')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.datid.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    lang={this.state.vocabLanguage}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={this.state.datid}
                                    onChange={e => this.handleChange(e.target.value, 'datid')}
                                    onBlur={() => this.onBlur('datid')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.førnutid.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    lang={this.state.vocabLanguage}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={this.state.førnutid}
                                    onChange={e => this.handleChange(e.target.value, 'førnutid')}
                                    onBlur={() => this.onBlur('førnutid')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('question.shared.label.en')}</td>
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
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    <input type="submit" value={
                        this.state.existingEntry
                        ? "" + t('my_vocab.shared.update.button')
                        : "" + t('my_vocab.shared.add.button')
                    } disabled={!this.state.itemToSave}/>
                    <input type="reset" value={"" + t('my_vocab.shared.cancel.button')}/>
                    {this.state.existingEntry && (
                        <input type="button"
                               className="danger"
                               value={"" + t('my_vocab.delete.action.button')}
                               onClick={() => this.onDelete()}
                               disabled={this.state.existingEntry.readOnly}
                        />
                    )}
                </p>
            </form>
        )
    }
}

export default withTranslation()(AddVerbum);
