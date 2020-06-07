import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import TextTidier from 'lib/text_tidier';
import LanguageInput from "@components/shared/language_input";
import UdtrykVocabEntry, {Data} from "./udtryk_vocab_entry";

interface Props extends WithTranslation {
    dbref: firebase.database.Reference;
    onCancel: () => void;
    onSearch: (text: string) => void;
    vocabLanguage: string;
    editingExistingEntry: UdtrykVocabEntry;
}

interface State {
    editingExistingKey: string | null;
    vocabLanguage: string;
    dansk: string;
    engelsk: string;
    itemToSave: UdtrykVocabEntry | undefined;
}

class AddPhrase extends React.Component<Props, State> {
    private readonly firstInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        if (props.editingExistingEntry) {
            this.state = this.initialEditState(props.editingExistingEntry);
        } else {
            this.state = this.initialEmptyState();
        }

        this.props.onSearch(this.state.dansk);
        this.firstInputRef = React.createRef();
    }

    initialEmptyState(): State {
        return {
            editingExistingKey: null,
            vocabLanguage: this.props.vocabLanguage,
            dansk: '',
            engelsk: '',
            itemToSave: undefined,
        };
    }

    initialEditState(entry: UdtrykVocabEntry) {
        return {
            editingExistingKey: entry.vocabKey,
            vocabLanguage: entry.lang,
            dansk: entry.dansk,
            engelsk: entry.engelsk,
            itemToSave: entry,
        };
    }

    itemToSave(state: State) {
        // no toLowerCase
        const dansk = TextTidier.normaliseWhitespace(state.dansk);
        const engelsk = TextTidier.normaliseWhitespace(state.engelsk);
        if (!(
            dansk !== ''
            && engelsk !== ''
        )) return null;

        const item: Data = {
            lang: state.vocabLanguage,
            dansk,
            engelsk,
        };

        return new UdtrykVocabEntry(
            state.editingExistingKey,
            item,
        );
    }

    handleChange(newValue: string, field: "vocabLanguage" | "dansk" | "engelsk") {
        const newState: State = { ...this.state };
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
                                    data-testid={"vocabulary-language"}
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
                                    size={30}
                                    value={this.state.dansk}
                                    onChange={e => this.handleChange(e.target.value, 'dansk')}
                                    data-testid="dansk"
                                    autoFocus={true}
                                    ref={this.firstInputRef}
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

export default withTranslation()(AddPhrase);
