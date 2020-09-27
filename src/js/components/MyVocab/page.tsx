import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

declare const firebase: typeof import('firebase');

import ShowList from './show_list';
import {VocabEntry, VocabRow} from "../../words/CustomVocab/types";
import {currentAllVocab, startAddVocab} from "lib/app_context";
import {CallbackRemover} from "lib/observer";
import DelayedSearchInput from "@components/MyVocab/delayed_search_input";

type Props = {
    user: firebase.User;
    onTestSubset: (vocabSubset: Set<string>) => void;
} & WithTranslation

export type VocabListItem = {
    vocabEntry: VocabEntry;
    vocabRow: VocabRow;
    flexMatchText: string;
}

type State = {
    unsubscribe?: CallbackRemover;
    vocabList?: VocabListItem[];
    isDeleting: boolean;
    selectedKeys: Set<string>;
    flexSearchTimer?: number;
    flexSearch?: string;
    flexMatchedKeys?: Set<string>;
}

class MyVocabPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            isDeleting: false,
            selectedKeys: new Set(),
        };
    }

    componentDidMount() {
        const unsubscribe = currentAllVocab.observe(vocabEntries => {
            const vocabList = this.buildVocabList(vocabEntries);
            this.setState({ vocabList });
            this.reEvaluateSearch(vocabList, this.state.flexSearch);
        });
        this.setState({ unsubscribe });
    }

    componentWillUnmount() {
        this.state?.unsubscribe?.();
    }

    private onFlexSearch(flexSearch: string) {
        this.setState({ flexSearch });
        if (this.state.vocabList) this.reEvaluateSearch(this.state.vocabList, flexSearch);
    }

    private buildVocabList(vocabEntries: VocabEntry[]) {
        return vocabEntries.map(vocabEntry => {
            const vocabRow = vocabEntry.getVocabRow();
            // FIXME: match text uses untranslated 'type'
            const flexMatchText = `${vocabRow.type} ${vocabRow.danskText} ${vocabRow.engelskText} ${vocabRow.detaljer} ${vocabRow.tags?.join(" ")}`;

            return {
                vocabEntry,
                vocabRow,
                flexMatchText,
            };
        });
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
            // FIXME: encapsulation, see also LoggedInBox and Wiring
            const vocabRef = firebase.database().ref(`users/${this.props.user.uid}/vocab`);
            const promises = Array.from(this.state.selectedKeys).map(vocabKey => vocabRef.child(vocabKey).remove());
            Promise.all(promises).then(() => {
                this.setState({ isDeleting: false });
            });
        }
    }

    private reEvaluateSearch(vocabList: VocabListItem[], flexSearch?: string) {
        const parts = (flexSearch || "").trim().split(' ').filter(part => part !== '');

        if (parts.length === 0) {
            this.setState({ flexMatchedKeys: undefined });
            return;
        }

        const flexMatchedKeys = vocabList.filter(
            item => this.vocabEntryMatchesParts(item, parts)
        ).map(item => item.vocabEntry.vocabKey);

        this.setState({ flexMatchedKeys: new Set<string>(flexMatchedKeys) });
    }

    private vocabEntryMatchesParts(item: VocabListItem, parts: string[]): boolean {
        return parts.every(part => {
            const negate = part.startsWith("-");
            part = part.replace(/^[+-]/, '');

            return item.flexMatchText.includes(part) != negate;
        });
    }

    render() {
        if (!this.state) return null;

        const { vocabList, isDeleting, flexMatchedKeys } = this.state;
        if (!vocabList) return null;

        const selectedKeys = isDeleting ? this.state.selectedKeys : new Set<string>();
        const anySelected = selectedKeys.size > 0;

        const { t } = this.props;

        return (
            <div>
                <h1>{t('my_vocab.header')}</h1>

                {!isDeleting && (
                    <p>
                        <input type="button" onClick={() => this.startDelete()} value={"" + t('my_vocab.delete.button')}/>
                        <input type="button" onClick={() => startAddVocab('substantiv')} value={"" + t('my_vocab.add_noun.button')}/>
                        <input type="button" onClick={() => startAddVocab('verbum')} value={"" + t('my_vocab.add_verb.button')}/>
                        <input type="button" onClick={() => startAddVocab('adjektiv')} value={"" + t('my_vocab.add_adjective.button')}/>
                        <input type="button" onClick={() => startAddVocab('udtryk')} value={"" + t('my_vocab.add_phrase.button')}/>
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
                    <DelayedSearchInput
                        defaultValue={""}
                        delayMillis={250}
                        onChange={s => this.onFlexSearch(s)}
                        autoFocus={true}/>
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
                    vocabList={vocabList}
                    isDeleting={isDeleting}
                    selectedKeys={selectedKeys}
                    onToggleSelected={vocabEntry => this.toggleSelected(vocabEntry)}
                    flexMatchedKeys={flexMatchedKeys}
                />
            </div>
        )
    }
}

export default withTranslation()(MyVocabPage);
