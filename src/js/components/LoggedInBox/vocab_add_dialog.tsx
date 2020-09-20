import * as React from "react";
import * as ReactModal from "react-modal";

import * as VocabLanguage from "lib/vocab_language";
import {currentSettings, currentUser} from "lib/app_context";
import {VocabEntry} from "../../words/CustomVocab/types";
import {WithTranslation, withTranslation} from "react-i18next";

declare const firebase: typeof import('firebase');

type Props = {
    modalAdding?: any; // FIXME: any
    onClose: () => void,
    editingExistingEntry?: VocabEntry;
} & WithTranslation;

type State = {
    vocabDbRef: firebase.database.Reference;
    vocabLanguage: VocabLanguage.Type;
};

class VocabAddDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            // FIXME: encapsulation, see also MyVocab (deletion) and Wiring
            vocabDbRef: firebase.database().ref(`users/${currentUser?.getValue()?.uid}/vocab`),
            vocabLanguage: currentSettings.getValue().vocabLanguage,
        };
    }

    render() {
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
                        onSearch: () => null,
                        vocabLanguage: this.state.vocabLanguage,
                        editingExistingEntry: this.props.editingExistingEntry,
                    }, null)}
                </div>
            </ReactModal>
        );
    }
}

export default withTranslation()(VocabAddDialog);
