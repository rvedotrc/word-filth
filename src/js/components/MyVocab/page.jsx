import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import AddAdjective from "../../words/CustomVocab/adjektiv/add";
import AddPhrase from '../../words/CustomVocab/udtryk/add';
import AddNoun from '../../words/CustomVocab/substantiv/add';
import AddVerb from '../../words/CustomVocab/verbum/add';

import CustomVocab from '../../words/CustomVocab';
import ShowList from './show_list';

class MyVocabPage extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/vocab`);
        ref.on('value', snapshot => this.setState({ vocab: snapshot.val() || [] }));
        this.setState({ ref });

        // FIXME: default settings
        firebase.database().ref(`users/${this.props.user.uid}/settings/vocabLanguage`)
            .once('value', snapshot => this.setState({ vocabLanguage: snapshot.val() || 'da' }));
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    startAdd(type) {
        this.setState({
            isAdding: type,
            editingExistingKey: null,
            editingExistingData: null,
            isDeleting: false
        });
    }

    startDelete() {
        this.setState({
            isAdding: null,
            isDeleting: true,
            selectedKeys: {},
        });
    }

    cancelAdd() {
        this.setState({ isAdding: null, searchText: null });
    }

    onAddSearch(text) {
        this.setState({ searchText: text });
    }

    cancelDelete() {
        this.setState({ isDeleting: false });
    }

    toggleSelected(vocabKey) {
        const selectedKeys= new Object(this.state.selectedKeys);
        selectedKeys[vocabKey] = !selectedKeys[vocabKey];
        this.setState({ selectedKeys });
    }

    doDelete() {
        const { t } = this.props;
        const selectedKeys = Object.keys(this.state.selectedKeys).filter(vocabKey => this.state.selectedKeys[vocabKey]);

        const message = (
            (selectedKeys.length === 1)
            ? t('my_vocab.delete.confirmation.1', { count: selectedKeys.length })
            : t('my_vocab.delete.confirmation.>1', { count: selectedKeys.length })
        );

        if (window.confirm(message)) {
            // TODO: also delete any question-results for this item
            const promises = selectedKeys.map(vocabKey => this.state.ref.child(vocabKey).remove());
            Promise.all(promises).then(() => {
                this.setState({ isDeleting: false });
            });
        }
    }

    startEdit(vocabKey) {
        if (this.state.isAdding || this.state.isDeleting) return;

        const vocabData = this.state.vocab[vocabKey];
        if (!vocabData) return;

        const type = {
          substantiv: AddNoun,
          verbum: AddVerb,
          adjektiv: AddAdjective,
          udtryk: AddPhrase,
        }[vocabData.type];

        if (!type) return;

        this.setState({
            isAdding: type,
            editingExistingKey: vocabKey,
            editingExistingData: vocabData,
            isDeleting: false,
        });
    }

    render() {
        if (!this.state) return null;
        const { vocab, vocabLanguage, isAdding, isDeleting } = this.state;
        if (!vocab) return null;
        if (!vocabLanguage) return null;

        const vocabList = new CustomVocab({ vocab }).getAll();

        const selectedKeys = this.state.selectedKeys || {};
        const anySelected = Object.keys(selectedKeys).some(key => selectedKeys[key]);

        const { t } = this.props;

        return (
            <div>
                <h1>{t('my_vocab.header')}</h1>

                {!isAdding && !isDeleting && (
                    <p>
                        <input type="button" onClick={() => this.startAdd(AddNoun)} value={t('my_vocab.add_noun.button')}/>
                        <input type="button" onClick={() => this.startAdd(AddVerb)} value={t('my_vocab.add_verb.button')}/>
                        <input type="button" onClick={() => this.startAdd(AddAdjective)} value={t('my_vocab.add_adjective.button')}/>
                        <input type="button" onClick={() => this.startAdd(AddPhrase)} value={t('my_vocab.add_phrase.button')}/>
                        <input type="button" onClick={() => this.startDelete()} value={t('my_vocab.delete.button')}/>
                    </p>
                )}
                {isAdding && (
                    <div style={{paddingBottom: '1em', borderBottom: '1px solid black', marginBottom: '1em'}}>
                        {React.createElement(isAdding, {
                            dbref: this.state.ref,
                            onCancel: () => this.cancelAdd(),
                            onSearch: this.onAddSearch.bind(this),
                            vocabLanguage,
                            editingExistingKey: this.state.editingExistingKey,
                            editingExistingData: this.state.editingExistingData,
                        }, null)}
                    </div>
                )}
                {isDeleting && (
                    <p>
                        <input type="button" onClick={() => this.doDelete()} disabled={!anySelected} value={t('my_vocab.delete.action.button')}/>
                        <input type="button" onClick={() => this.cancelDelete()} value={t('my_vocab.shared.cancel.button')}/>
                    </p>
                )}

                <ShowList
                    vocabList={vocabList}
                    isDeleting={!!isDeleting}
                    selectedKeys={this.state.selectedKeys || {}}
                    onToggleSelected={key => this.toggleSelected(key)}
                    onEdit={key => this.startEdit(key)}
                    searchText={this.state.searchText}
                />
            </div>
        )
    }
}

MyVocabPage.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default withTranslation()(MyVocabPage);