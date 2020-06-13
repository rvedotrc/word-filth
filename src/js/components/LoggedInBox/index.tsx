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
import {AdderComponentClass, VocabEntryType} from "../../words/CustomVocab/types";

type Props = {
    user: firebase.User;
} & WithTranslation

type State = {
    vocabRef?: firebase.database.Reference;
    vocabLanguage?: string;
    modalAdding?: any; // FIXME-any
    adderFormClass?: AdderComponentClass;
}

class LoggedInBox extends React.Component<Props, State> {
    getAdderClass(type: VocabEntryType): AdderComponentClass {
        switch (type) {
            case 'substantiv': return AddNoun;
            case 'verbum': return AddVerbum;
            case 'adjektiv': return AddAdjektiv;
            case 'udtryk': return AddPhrase;
            default: throw `Bad type ${type}`;
        }
    }

    startAddVocab(type: VocabEntryType) {
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
                });
            });
    }

    closeModal() {
        this.setState({ modalAdding: undefined });
    }

    render() {
        const modalAdding = this.state?.modalAdding;
        const vocabLanguage = this.state?.vocabLanguage;

        return (
            <div>
                <LoginBar user={this.props.user} onAddVocab={type => this.startAddVocab(type)}/>
                <Workspace user={this.props.user}/>

                {modalAdding && <div>
                    <ReactModal
                        isOpen={true}
                        contentLabel={"Test"}
                        appElement={document.getElementById("react_container") || undefined}
                    >
                        <div onKeyDown={e => {
                            if (e.key === "Escape") this.closeModal();
                        }}>
                            {React.createElement(modalAdding, {
                                dbref: this.state.vocabRef,
                                onCancel: () => this.closeModal(),
                                onSearch: () => null,
                                vocabLanguage,
                                editingExistingEntry: null,
                            }, null)}
                        </div>
                    </ReactModal>
                </div>}

            </div>
        )
    }
}

export default withTranslation()(LoggedInBox);
