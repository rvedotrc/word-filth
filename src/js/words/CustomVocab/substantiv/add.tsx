import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import Bøjning from "../../../shared/bøjning";
import TextTidier from '../../../shared/text_tidier';
import GenderInput from "../../../components/shared/gender_input";
import LanguageInput from "../../../components/shared/language_input";
import SubstantivVocabEntry, {Data} from "./substantiv_vocab_entry";

interface Props extends WithTranslation {
    dbref: firebase.database.Reference;
    onCancel: () => void;
    onSearch: (text: string) => void;
    vocabLanguage: string;
    editingExistingKey: string;
    editingExistingData: SubstantivVocabEntry;
}

interface State {
    editingExistingKey: string;
    vocabLanguage: string;
    køn: string;
    ubestemtEntal: string;
    bøjning: string;
    bestemtEntal: string;
    ubestemtFlertal: string;
    bestemtFlertal: string;
    engelsk: string;
    itemToSave: SubstantivVocabEntry;
}

class AddNoun extends React.Component<Props, State> {

    private readonly firstInputRef: React.RefObject<HTMLSelectElement>;

    constructor(props: Props) {
        super(props);
        this.state = this.initialState(this.props.editingExistingKey, this.props.editingExistingData);
        this.props.onSearch(this.state.ubestemtEntal); // TODO: or other forms?
        this.firstInputRef = React.createRef();
    }

    initialState(key: string, data: SubstantivVocabEntry) {
        const s: State = {
            editingExistingKey: key,
            vocabLanguage: (data && data.lang) || this.props.vocabLanguage,
            køn: (data && data.køn) || null,
            ubestemtEntal: (data && data.ubestemtEntal) || '',
            bøjning: '',
            ubestemtFlertal: (data && data.ubestemtFlertal) || '',
            bestemtEntal: (data && data.bestemtEntal) || '',
            bestemtFlertal: (data && data.bestemtFlertal) || '',
            engelsk: (data && data.engelsk) || '',
            itemToSave: null,
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state: State): SubstantivVocabEntry {
        const tidyLowerCase = (s: string) => TextTidier.normaliseWhitespace(s).toLowerCase();

        const item: Data = {
            lang: state.vocabLanguage,
            køn: state.køn,
            ubestemtEntal: tidyLowerCase(state.ubestemtEntal),
            bestemtEntal: tidyLowerCase(state.bestemtEntal),
            ubestemtFlertal: tidyLowerCase(state.ubestemtFlertal),
            bestemtFlertal: tidyLowerCase(state.bestemtFlertal),
            engelsk: tidyLowerCase(state.engelsk),
        };

        if (!item.lang
          || !item.køn
          || (
              !item.ubestemtEntal
                && !item.bestemtEntal
                && !item.ubestemtFlertal
                && !item.bestemtFlertal
            )
        ) return;

        return new SubstantivVocabEntry(
            state.editingExistingKey,
            item,
        );
    }

    handleChange(newValue: string, field: "vocabLanguage" | "køn" | "ubestemtEntal" | "bøjning" | "bestemtEntal" | "ubestemtFlertal" | "bestemtFlertal" | "engelsk") {
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

        const result = new Bøjning().expandSubstantiv(
            TextTidier.normaliseWhitespace(newState.ubestemtEntal),
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
            this.setState(this.initialState(null, null));
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
                                    autoFocus={true}
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

export default withTranslation()(AddNoun);
