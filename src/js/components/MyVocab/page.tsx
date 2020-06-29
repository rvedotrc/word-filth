import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

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
    }

    componentWillUnmount() {
        this.state?.ref?.off('value', this.state.listener);
    }

    startDelete() {
        this.setState({
            isDeleting: true,
            selectedKeys: new Set(),
        });
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

    render() {
        if (!this.state) return null;

        const { vocab, isDeleting } = this.state;
        if (!vocab) return null;

        const vocabList = new CustomVocab({ vocab }).getAll();

        const selectedKeys = isDeleting ? this.state.selectedKeys : new Set<string>();
        const anySelected = selectedKeys.size > 0;

        const { t } = this.props;

        return (
            <div>
                <h1>{t('my_vocab.header')}</h1>

                {!isDeleting && (
                    <p>
                        <input type="button" onClick={() => this.startDelete()} value={"" + t('my_vocab.delete.button')}/>
                    </p>
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
                    searchText={this.state.searchText}
                />
            </div>
        )
    }
}

export default withTranslation()(MyVocabPage);
