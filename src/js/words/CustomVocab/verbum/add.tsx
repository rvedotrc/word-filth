import * as React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';

import Bøjning from "lib/bøjning";
import TextTidier from 'lib/text_tidier';
import LanguageInput from "@components/shared/language_input";
import VerbumVocabEntry, {Data} from "./verbum_vocab_entry";

interface Props extends WithTranslation{
    dbref: firebase.database.Reference;
    onCancel: () => void;
    onSearch: (text: string) => void;
    vocabLanguage: string;
    editingExistingEntry: VerbumVocabEntry;
}

interface State {
    editingExistingKey: string;
    vocabLanguage: string;
    infinitiv: string;
    bøjning: string;
    nutid: string;
    datid: string;
    førnutid: string;
    engelsk: string;
    itemToSave: VerbumVocabEntry;
}

class AddVerbum extends React.Component<Props, State> {
    private readonly firstInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        if (props.editingExistingEntry) {
            this.state = this.initialEditState(props.editingExistingEntry);
        } else {
            this.state = this.initialEmptyState();
        }

        this.props.onSearch(this.state.infinitiv);
        this.firstInputRef = React.createRef();
    }

    initialEmptyState(): State {
        return {
            editingExistingKey: null,
            vocabLanguage: this.props.vocabLanguage,
            infinitiv: '',
            bøjning: '',
            nutid: '',
            datid: '',
            førnutid: '',
            engelsk: '',
            itemToSave: null,
        };
    }

    initialEditState(entry: VerbumVocabEntry) {
        return {
            editingExistingKey: entry.vocabKey,
            vocabLanguage: entry.lang,
            infinitiv: entry.infinitiv.replace(/^(at|å) /, ''),
            bøjning: '',
            nutid: entry.nutid.join("; "),
            datid: entry.datid.join("; "),
            førnutid: entry.førnutid.join("; "),
            engelsk: entry.engelsk,
            itemToSave: entry,
        };
    }

    itemToSave(state: State): VerbumVocabEntry {
        const tidyLowerCase = (s: string) => TextTidier.normaliseWhitespace(s.toLowerCase());
        const tidyMultiLowerCase = (s: string) => TextTidier.toMultiValue(s.toLowerCase());

        const infinitivePrefix = ({
            da: 'at ',
            no: 'å ',
        } as any)[state.vocabLanguage] || ''; // FIXME-any

        const item: Data = {
            lang: state.vocabLanguage,
            infinitiv: infinitivePrefix + tidyLowerCase(state.infinitiv).replace(/^(at|å) /, ''),
            nutid: tidyMultiLowerCase(state.nutid),
            datid: tidyMultiLowerCase(state.datid),
            førnutid: tidyMultiLowerCase(state.førnutid),
            engelsk: null,
        };

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
            state.editingExistingKey,
            item,
        );
    }

    handleChange(newValue: string, field: "vocabLanguage" | "infinitiv" | "bøjning" | "nutid" | "datid" | "førnutid" | "engelsk") {
        const newState = { ...this.state };
        newState[field] = newValue;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
        this.props.onSearch(newState.infinitiv);
    }

    handleBøjning(e: React.ChangeEvent<HTMLInputElement>) {
        let newState: State = { ...this.state };

        const infinitiv = TextTidier.normaliseWhitespace(this.state.infinitiv)
          .toLowerCase().replace(/^(at|å) /, '');

        const bøjning = e.target.value.toLowerCase(); // no trim
        newState.bøjning = bøjning;

        const result = new Bøjning().expandVerbum(
            infinitiv,
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
                <h2>{t('my_vocab.add_verb.heading')}</h2>

                <p>{t('my_vocab.add_verb.help_1')}</p>
                <p>{t('my_vocab.add_verb.help_2')}</p>
                <p>{t('my_vocab.add_verb.help_3')}</p>

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
                            <td>{t('my_vocab.add_verb.infinitive.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
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
                                    value={this.state.nutid}
                                    onChange={e => this.handleChange(e.target.value, 'nutid')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.datid.label')}:</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.datid}
                                    onChange={e => this.handleChange(e.target.value, 'datid')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.førnutid.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.førnutid}
                                    onChange={e => this.handleChange(e.target.value, 'førnutid')}
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

export default withTranslation()(AddVerbum);
