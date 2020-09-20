import * as React from "react";
import * as ReactModal from "react-modal";

import * as VocabLanguage from "lib/vocab_language";
import {currentAllVocab, currentSettings, currentUser} from "lib/app_context";
import {VocabEntry} from "../../words/CustomVocab/types";
import {WithTranslation, withTranslation} from "react-i18next";
import {CallbackRemover} from "lib/observer";

declare const firebase: typeof import('firebase');

type Props = {
    modalAdding?: any; // FIXME: any
    onClose: () => void,
    editingExistingEntry?: VocabEntry;
} & WithTranslation;

type State = {
    vocabDbRef: firebase.database.Reference;
    vocabLanguage: VocabLanguage.Type;
    searchText: string;
    existingMatchingVocab?: VocabEntry[];
    remover?: CallbackRemover;
};

class VocabAddDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            // FIXME: encapsulation, see also MyVocab (deletion) and Wiring
            vocabDbRef: firebase.database().ref(`users/${currentUser?.getValue()?.uid}/vocab`),
            searchText: "",
            vocabLanguage: currentSettings.getValue().vocabLanguage,
        };
    }

    componentDidMount() {
        const remover = currentAllVocab.observe(vocabEntries =>
            this.updateSearch(this.state.searchText, vocabEntries)
        );
        this.setState({ remover });
    }

    componentWillUnmount() {
        this.state?.remover?.();
    }

    private onSearch(searchText: string) {
        this.setState({ searchText });
        this.updateSearch(searchText, currentAllVocab.getValue());
    }

    private updateSearch(searchText: string, vocabEntries: VocabEntry[]) {
        if (searchText.trim() !== "") {
            this.setState({
                existingMatchingVocab: vocabEntries.filter(vocabEntry =>
                    vocabEntry.getVocabRow().danskText.includes(searchText)
                    ||
                    vocabEntry.getVocabRow().engelskText.includes(searchText)
                    ||
                    vocabEntry.getVocabRow().detaljer.includes(searchText)
                ),
            });
        } else {
            this.setState({
                existingMatchingVocab: undefined,
            });
        }
    }

    render() {
        const { t } = this.props;
        const { existingMatchingVocab } = this.state;

        return (
            <ReactModal
                isOpen={true}
                contentLabel={"Test"}
                appElement={document.getElementById("react_container") || undefined}
                className="modalContentClass container"
            >
                <div onKeyDown={e => {
                    if (e.key === "Escape") this.props.onClose();
                }}>
                    {React.createElement(this.props.modalAdding, {
                        dbref: this.state.vocabDbRef,
                        onCancel: () => this.props.onClose(),
                        onSearch: (text: string) => this.onSearch(text),
                        vocabLanguage: this.state.vocabLanguage,
                        editingExistingEntry: this.props.editingExistingEntry,
                    }, null)}



                    {existingMatchingVocab && (
                        <>
                            <p>{t('add_vocab.existing_vocab.match_count', {
                                skipInterpolation: true,
                                postProcess: 'pp',
                                text: this.state.searchText,
                                count: existingMatchingVocab.length,
                            })}</p>

                            {existingMatchingVocab.length > 0 && <table>
                                <thead>
                                    <th>{t('my_vocab.table.heading.type')}</th>
                                    <th>{t('my_vocab.table.heading.danish')}</th>
                                    <th>{t('my_vocab.table.heading.english')}</th>
                                    <th>{t('my_vocab.table.heading.details')}</th>
                                    <th>{t('my_vocab.table.heading.tags')}</th>
                                </thead>
                                <tbody>
                                    {existingMatchingVocab.map(vocabEntry => (
                                        <tr key={vocabEntry.vocabKey}>
                                            <td>{vocabEntry.getVocabRow().type}</td>
                                            <td>{vocabEntry.getVocabRow().danskText}</td>
                                            <td>{vocabEntry.getVocabRow().engelskText}</td>
                                            <td>{vocabEntry.getVocabRow().detaljer}</td>
                                            <td>{vocabEntry.getVocabRow().tags?.join(" ")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>}
                        </>
                    )}
                </div>
            </ReactModal>
        );
    }
}

export default withTranslation()(VocabAddDialog);
