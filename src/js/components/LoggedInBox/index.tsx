import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import * as ReactModal from 'react-modal';

declare const firebase: typeof import('firebase');

import Workspace from '../Workspace';
import LoginBar from '../LoginBar';
import AddNoun from "../../words/CustomVocab/substantiv/add";
import AddVerbum from "../../words/CustomVocab/verbum/add";
import AddAdjektiv from "../../words/CustomVocab/adjektiv/add";
import AddPhrase from "../../words/CustomVocab/udtryk/add";
import {AdderComponentClass, VocabEntry, VocabEntryType} from "../../words/CustomVocab/types";
import * as AppContext from 'lib/app_context';

type Props = {
    user: firebase.User;
} & WithTranslation

type State = {
    vocabRef?: firebase.database.Reference;
    vocabLanguage?: string;
    modalAdding?: any; // FIXME-any
    editingExistingEntry?: VocabEntry;
    adderFormClass?: AdderComponentClass;
}

class LoggedInBox extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        AppContext.onAddVocab(
            (type: VocabEntryType) => this.startAddVocab(type)
        );
        AppContext.onEditVocab(
            (vocabEntry: VocabEntry) => this.startEditVocab(vocabEntry)
        );
    }

    componentWillUnmount(): void {
        AppContext.onAddVocab(undefined);
        AppContext.onEditVocab(undefined);
    }

    private getAdderClass(type: VocabEntryType): AdderComponentClass {
        switch (type) {
            case 'substantiv': return AddNoun;
            case 'verbum': return AddVerbum;
            case 'adjektiv': return AddAdjektiv;
            case 'udtryk': return AddPhrase;
            default: throw `Bad type ${type}`;
        }
    }

    private startAddVocab(type: VocabEntryType) {
        const modalAdding = this.getAdderClass(type);

        const vocabRef = firebase.database().ref(`users/${this.props.user.uid}/vocab`);

        // FIXME: default settings
        firebase.database().ref(`users/${this.props.user.uid}/settings/vocabLanguage`)
            .once('value', snapshot => {
                const vocabLanguage = snapshot.val() || 'da';
                this.setState({
                    vocabRef,
                    vocabLanguage,
                    modalAdding,
                    editingExistingEntry: undefined,
                });
            });
    }

    private startEditVocab(vocabEntry: VocabEntry) {
        const vocabRef = firebase.database().ref(`users/${this.props.user.uid}/vocab`);
        const modalAdding = this.getAdderClass(vocabEntry.type);

        this.setState({
            vocabRef,
            vocabLanguage: 'da',
            modalAdding,
            editingExistingEntry: vocabEntry,
        });
    }

    private closeModal() {
        this.setState({ modalAdding: undefined });
    }

    render() {
        if (!this.state) return null;

        const { modalAdding, vocabLanguage, editingExistingEntry } = this.state;

        return (
            <div>
                <LoginBar user={this.props.user} onAddVocab={type => this.startAddVocab(type)}/>
                <Workspace user={this.props.user}/>

                {modalAdding && <div>
                    <ReactModal
                        isOpen={true}
                        contentLabel={"Test"}
                        appElement={document.getElementById("react_container") || undefined}
                        className="modalContentClass container"
                    >
                        <div onKeyDown={e => {
                            if (e.key === "Escape") this.closeModal();
                        }}>
                            {React.createElement(modalAdding, {
                                dbref: this.state.vocabRef,
                                onCancel: () => this.closeModal(),
                                onSearch: () => null,
                                vocabLanguage,
                                editingExistingEntry,
                            }, null)}
                        </div>
                    </ReactModal>
                </div>}

            </div>
        )
    }
}

export default withTranslation()(LoggedInBox);
