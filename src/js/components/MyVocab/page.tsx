import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

declare const firebase: typeof import('firebase');

import CustomVocab from '../../words/CustomVocab';
import ShowList from './show_list';
import DataSnapshot = firebase.database.DataSnapshot;
import {VocabEntry} from "../../words/CustomVocab/types";
import BuiltInVerbs from "../../words/BuiltInVerbs";

type Props = {
    user: firebase.User;
    onTestSubset: (vocabSubset: Set<string>) => void;
} & WithTranslation

type State = {
    vocabRef?: firebase.database.Reference;
    vocabListener?: (snapshot: DataSnapshot) => void;
    settingsRef?: firebase.database.Reference;
    settingsListener?: (snapshot: DataSnapshot) => void;
    vocabList?: VocabEntry[];
    deactivateBuiltinVerbs: boolean;
    isDeleting: boolean;
    selectedKeys: Set<string>;
    flexSearchText: string;
    flexMatchedKeys?: Set<string>;
}

class MyVocabPage extends React.Component<Props, State> {

    componentDidMount() {
        const vocabRef = firebase.database().ref(`users/${this.props.user.uid}/vocab`);
        const vocabListener = (snapshot: DataSnapshot) => this.onDBChange(snapshot.val() || []);
        this.setState({ vocabRef, vocabListener });
        vocabRef.on('value', vocabListener);

        const settingsRef = firebase.database().ref(`users/${this.props.user.uid}/settings`);
        const settingsListener = (snapshot: DataSnapshot) => this.onSettingsChange(snapshot.val() || []);
        this.setState({ settingsRef, settingsListener });
        settingsRef.on('value', settingsListener);
    }

    componentWillUnmount() {
        this.state?.vocabRef?.off('value', this.state.vocabListener);
        this.state?.settingsRef?.off('value', this.state.settingsListener);
    }

    private onDBChange(vocab: any) {
        const vocabList = new CustomVocab({ vocab }).getAll();
        this.setState({ vocabList });
        this.reEvaluateSearch(vocabList, this.state.flexSearchText || "");
    }

    private onSettingsChange(settings: any) {
        this.setState({ deactivateBuiltinVerbs: settings['deactivateBuiltinVerbs'] });
        if (this.state.vocabList) this.reEvaluateSearch(this.state.vocabList, this.state.flexSearchText || "");
    }

    private startDelete() {
        this.setState({
            isDeleting: true,
            selectedKeys: new Set(),
        });
    }

    private cancelDelete() {
        this.setState({ isDeleting: false });
    }

    private toggleSelected(vocabEntry: VocabEntry) {
        const vocabKey = vocabEntry.vocabKey;

        if (this.state.selectedKeys.has(vocabKey)) {
            this.state.selectedKeys.delete(vocabKey);
        } else {
            this.state.selectedKeys.add(vocabKey);
        }

        this.setState({ selectedKeys: this.state.selectedKeys });
    }

    private doDelete() {
        const { t } = this.props;

        const count = this.state.selectedKeys.size;

        const message = (
            (count === 1)
            ? t('my_vocab.delete.confirmation.1', { count })
            : t('my_vocab.delete.confirmation.>1', { count })
        );

        if (window.confirm(message)) {
            // TODO: also delete any question-results for this item
            const promises = Array.from(this.state.selectedKeys).map(vocabKey => this.state.vocabRef?.child(vocabKey).remove());
            Promise.all(promises).then(() => {
                this.setState({ isDeleting: false });
            });
        }
    }

    private onFlexSearch(newValue: string) {
        this.setState({flexSearchText: newValue});
        if (this.state.vocabList) this.reEvaluateSearch(this.state.vocabList, newValue);
    }

    private reEvaluateSearch(vocabList: VocabEntry[], newValue: string) {
        const parts = newValue.trim().split(' ').filter(part => part !== '');

        if (parts.length === 0) {
            this.setState({ flexMatchedKeys: undefined });
            return;
        }

        const flexMatchedKeys = vocabList.filter(
            vocabEntry => this.vocabEntryMatchesParts(vocabEntry, parts)
        ).map(vocabEntry => vocabEntry.vocabKey);

        this.setState({ flexMatchedKeys: new Set<string>(flexMatchedKeys) });
    }

    private vocabEntryMatchesParts(vocabEntry: VocabEntry, parts: string[]): boolean {
        const row = vocabEntry.getVocabRow();
        const allText = `${row.type} ${row.danskText} ${row.engelskText} ${row.detaljer} ${row.tags?.join(" ")}`;

        return parts.every(part => {
            const negate = part.startsWith("-");
            part = part.replace(/^[+-]/, '');

            return allText.includes(part) != negate;
        });
    }

    private maybeBuiltInVocab(): VocabEntry[] {
        if (this.state.deactivateBuiltinVerbs) return [];

        return BuiltInVerbs.getAllAsVocabEntries();
    }

    render() {
        if (!this.state) return null;

        const { vocabList, isDeleting, flexSearchText, flexMatchedKeys } = this.state;
        if (!vocabList) return null;

        const aggregateVocab = [
            ...vocabList,
            ...this.maybeBuiltInVocab(),
        ];

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

                <p>
                    {t('my_vocab.search.label') + ' '}
                    <input
                        type={"text"}
                        autoFocus={true}
                        value={flexSearchText || ""}
                        onChange={evt => this.onFlexSearch(evt.target.value)}
                    />
                    {' '}
                    {flexMatchedKeys && (
                        <button
                            onClick={() => {
                                this.props.onTestSubset(flexMatchedKeys)
                            }}
                        >
                            {t('my_vocab.search.practice.button')}
                        </button>
                    )}
                </p>

                <ShowList
                    vocabList={aggregateVocab}
                    isDeleting={isDeleting}
                    selectedKeys={selectedKeys}
                    onToggleSelected={vocabEntry => this.toggleSelected(vocabEntry)}
                    searchText={""}
                    flexMatchedKeys={flexMatchedKeys}
                />
            </div>
        )
    }
}

export default withTranslation()(MyVocabPage);
