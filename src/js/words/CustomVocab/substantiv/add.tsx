import * as React from 'react';
import {withTranslation} from 'react-i18next';

import TextTidier from 'lib/text_tidier';
import GenderInput from "@components/shared/gender_input";
import LanguageInput from "@components/shared/language_input";
import SubstantivVocabEntry, {Data} from "./substantiv_vocab_entry";
import {AdderProps} from "../types";
import {bøj, expandSubstantiv} from "lib/bøjning";

type Props = AdderProps;

type State = {
    vocabKey: string;
    editingExistingKey: boolean;
    vocabLanguage: string;
    køn: string | null;
    ubestemtEntal: string;
    bøjning: string;
    bestemtEntal: string;
    ubestemtFlertal: string;
    bestemtFlertal: string;
    engelsk: string;
    tags: string;
    itemToSave: SubstantivVocabEntry | undefined;
}

class AddNoun extends React.Component<Props, State> {

    private readonly firstInputRef: React.RefObject<HTMLSelectElement>;

    constructor(props: Props) {
        super(props);

        if (props.editingExistingEntry) {
            this.state = this.initialEditState(props.editingExistingEntry as SubstantivVocabEntry);
        } else {
            this.state = this.initialEmptyState();
        }

        this.props.onSearch(this.state.ubestemtEntal); // TODO: or other forms?
        this.firstInputRef = React.createRef();
    }

    initialEmptyState(): State {
        return {
            vocabKey: this.props.dbref.push().key as string,
            editingExistingKey: false,
            vocabLanguage: this.props.vocabLanguage,
            køn: null,
            ubestemtEntal: '',
            bøjning: '',
            ubestemtFlertal: '',
            bestemtEntal: '',
            bestemtFlertal: '',
            engelsk: '',
            tags: this.state?.tags || '',
            itemToSave: undefined,
        };
    }

    initialEditState(entry: SubstantivVocabEntry) {
        return {
            vocabKey: entry.vocabKey,
            editingExistingKey: true,
            vocabLanguage: entry.lang,
            køn: entry.køn,
            ubestemtEntal: entry.ubestemtEntal || '',
            bøjning: '',
            ubestemtFlertal: entry.ubestemtFlertal || '',
            bestemtEntal: entry.bestemtEntal || '',
            bestemtFlertal: entry.bestemtFlertal || '',
            engelsk: entry.engelsk || '',
            tags: (entry.tags || []).join(" "),
            itemToSave: entry,
        };
    }

    itemToSave(state: State): SubstantivVocabEntry | undefined {
        const tidyLowerCase = (s: string) => TextTidier.normaliseWhitespace(s).toLowerCase() || null;

        if (!state.køn) return;

        const item: Data = {
            lang: state.vocabLanguage,
            køn: state.køn,
            ubestemtEntal: tidyLowerCase(state.ubestemtEntal),
            bestemtEntal: tidyLowerCase(state.bestemtEntal),
            ubestemtFlertal: tidyLowerCase(state.ubestemtFlertal),
            bestemtFlertal: tidyLowerCase(state.bestemtFlertal),
            engelsk: tidyLowerCase(state.engelsk),
            tags: TextTidier.parseTags(state.tags),
        };

        if (!item.lang
          || (
              !item.ubestemtEntal
                && !item.bestemtEntal
                && !item.ubestemtFlertal
                && !item.bestemtFlertal
            )
        ) return;

        return new SubstantivVocabEntry(
            state.vocabKey,
            item,
        );
    }

    handleChange(newValue: string, field: "vocabLanguage" | "køn" | "ubestemtEntal" | "bøjning" | "bestemtEntal" | "ubestemtFlertal" | "bestemtFlertal" | "engelsk" | "tags") {
        const newState: State = { ...this.state };
        newState[field] = newValue;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
        this.props.onSearch(newState.ubestemtEntal); // TODO: or other forms?
    }

    handleBøjning(e: React.ChangeEvent<HTMLInputElement>) {
        let newState: State = { ...this.state };

        const bøjning = e.target.value.toLowerCase(); // no trim
        newState.bøjning = bøjning;

        const result = expandSubstantiv(
            TextTidier.normaliseWhitespace(newState.ubestemtEntal),
            TextTidier.normaliseWhitespace(bøjning),
        );

        if (result) {
            newState = { ...newState, ...result };
        }

        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    onBlur(field: "bestemtEntal" | "ubestemtFlertal" | "bestemtFlertal") {
        this.setState((prevState: State) => {
            const expanded = bøj(this.state.ubestemtEntal, prevState[field]);
            const newState: State = {...prevState};
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
                <h1>{t('my_vocab.add_noun.heading')}</h1>

                <div className={"help"}>
                    <p>{t('my_vocab.add_noun.help_1')}</p>
                    <p>{t('my_vocab.add_noun.help_2')}</p>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <td>{t('my_vocab.shared.language.label')}</td>
                            <td>
                                <LanguageInput
                                    autoFocus={false}
                                    data-testid={"vocabulary-language"}
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
                                    onChange={v => this.handleChange(v || '', 'køn')}
                                    autoFocus={true}
                                    data-testid="køn"
                                    inputRef={this.firstInputRef}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.indefinite_singular.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
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
                                    size={30}
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
                                    size={30}
                                    value={this.state.bestemtEntal}
                                    onChange={e => this.handleChange(e.target.value, 'bestemtEntal')}
                                    onBlur={() => this.onBlur('bestemtEntal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.indefinite_plural.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.ubestemtFlertal}
                                    onChange={e => this.handleChange(e.target.value, 'ubestemtFlertal')}
                                    onBlur={() => this.onBlur('ubestemtFlertal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.definite_plural.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.bestemtFlertal}
                                    onChange={e => this.handleChange(e.target.value, 'bestemtFlertal')}
                                    onBlur={() => this.onBlur('bestemtFlertal')}
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
                        <tr>
                            <td>{t('question.shared.label.tags')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
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

export default withTranslation()(AddNoun);
