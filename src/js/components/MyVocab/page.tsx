import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import AddAdjective from "../../words/CustomVocab/adjektiv/add";
import AddPhrase from '../../words/CustomVocab/udtryk/add';
import AddNoun from '../../words/CustomVocab/substantiv/add';
import AddVerb from '../../words/CustomVocab/verbum/add';

declare const firebase: typeof import('firebase');

import CustomVocab from '../../words/CustomVocab';
import ShowList from './show_list';
import DataSnapshot = firebase.database.DataSnapshot;
import {VocabEntry} from "../../words/CustomVocab/types";

type Props = {
    user: firebase.User;
} & WithTranslation

type State = {
    ref?: firebase.database.Reference;
    listener?: (snapshot: DataSnapshot) => void;
    vocab: any; // FIXME-any
    vocabLanguage: string;
    isAdding: any; // FIXME-any
    editingExistingEntry: VocabEntry | null;
    isDeleting: boolean;
    selectedKeys: Set<string>;
    searchText: string;
}

class MyVocabPage extends React.Component<Props, State> {

    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/vocab`);
        const listener = (snapshot: DataSnapshot) => this.setState({ vocab: snapshot.val() || [] });
        this.setState({ ref, listener });
        ref.on('value', listener);

        // FIXME: default settings
        firebase.database().ref(`users/${this.props.user.uid}/settings/vocabLanguage`)
            .once('value', snapshot => this.setState({ vocabLanguage: snapshot.val() || 'da' }));
    }

    componentWillUnmount() {
        this.state?.ref?.off('value', this.state.listener);
    }

    startAdd(type: any) { // FIXME-any
        this.setState({
            isAdding: type,
            editingExistingEntry: null,
            isDeleting: false
        });
    }

    startDelete() {
        this.setState({
            isAdding: null,
            isDeleting: true,
            selectedKeys: new Set(),
        });
    }

    cancelAdd() {
        this.setState({ isAdding: null, searchText: '' });
    }

    onAddSearch(text: string) {
        this.setState({ searchText: text });
    }

    cancelDelete() {
        this.setState({ isDeleting: false });
    }

    toggleSelected(vocabEntry: VocabEntry) {
        const vocabKey = vocabEntry.vocabKey as string;

        if (this.state.selectedKeys.has(vocabKey)) {
            this.state.selectedKeys.delete(vocabKey);
        } else {
            this.state.selectedKeys.add(vocabKey);
        }

        this.setState({ selectedKeys: this.state.selectedKeys });
    }

    doDelete() {
        const { t } = this.props;

        const count = this.state.selectedKeys.size;

        const message = (
            (count === 1)
            ? t('my_vocab.delete.confirmation.1', { count })
            : t('my_vocab.delete.confirmation.>1', { count })
        );

        if (window.confirm(message)) {
            // TODO: also delete any question-results for this item
            const promises = Array.from(this.state.selectedKeys).map(vocabKey => this.state.ref?.child(vocabKey).remove());
            Promise.all(promises).then(() => {
                this.setState({ isDeleting: false });
            });
        }
    }

    startEdit(vocabEntry: VocabEntry) {
        if (this.state.isAdding || this.state.isDeleting) return;

        const type = ({
          substantiv: AddNoun,
          verbum: AddVerb,
          adjektiv: AddAdjective,
          udtryk: AddPhrase,
        } as any)[vocabEntry.type]; // FIXME-any

        if (!type) return;

        this.setState({
            isAdding: type,
            editingExistingEntry: vocabEntry,
            isDeleting: false,
        });
    }

    render() {
        if (!this.state) return null;

        const { vocab, vocabLanguage, isAdding, isDeleting } = this.state;
        if (!vocab) return null;
        if (!vocabLanguage) return null;

        const vocabList = new CustomVocab({ vocab }).getAll();

        const selectedKeys = isDeleting ? this.state.selectedKeys : new Set<string>();
        const anySelected = selectedKeys.size > 0;

        const { t } = this.props;

        return (
            <div>
                <h1>{t('my_vocab.header')}</h1>

                {!isAdding && !isDeleting && (
                    <p>
                        <input type="button" onClick={() => this.startAdd(AddNoun)} value={"" + t('my_vocab.add_noun.button')}/>
                        <input type="button" onClick={() => this.startAdd(AddVerb)} value={"" + t('my_vocab.add_verb.button')}/>
                        <input type="button" onClick={() => this.startAdd(AddAdjective)} value={"" + t('my_vocab.add_adjective.button')}/>
                        <input type="button" onClick={() => this.startAdd(AddPhrase)} value={"" + t('my_vocab.add_phrase.button')}/>
                        <input type="button" onClick={() => this.startDelete()} value={"" + t('my_vocab.delete.button')}/>
                    </p>
                )}
                {isAdding && (
                    <div style={{paddingBottom: '1em', borderBottom: '1px solid black', marginBottom: '1em'}}>
                        {React.createElement(isAdding, {
                            dbref: this.state.ref,
                            onCancel: () => this.cancelAdd(),
                            onSearch: this.onAddSearch.bind(this),
                            vocabLanguage,
                            editingExistingEntry: this.state.editingExistingEntry,
                        }, null)}
                    </div>
                )}
                {isDeleting && (
                    <p>
                        <input type="button" onClick={() => this.doDelete()} disabled={!anySelected} value={"" + t('my_vocab.delete.action.button')}/>
                        <input type="button" onClick={() => this.cancelDelete()} value={"" + t('my_vocab.shared.cancel.button')}/>
                    </p>
                )}

                <ShowList
                    vocabList={vocabList}
                    isDeleting={!!isDeleting}
                    selectedKeys={selectedKeys}
                    onToggleSelected={vocabEntry => this.toggleSelected(vocabEntry)}
                    onEdit={vocabEntry => this.startEdit(vocabEntry)}
                    searchText={this.state.searchText}
                />
            </div>
        )
    }
}

export default withTranslation()(MyVocabPage);
