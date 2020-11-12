import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import VocabAddDialog from "./vocab_add_dialog";

declare const firebase: typeof import('firebase');

import Workspace from '../Workspace';
import LoginBar from '../LoginBar/logged_in';
import AddNoun from "../../words/CustomVocab/substantiv/add";
import AddVerbum from "../../words/CustomVocab/verbum/add";
import AddAdjektiv from "../../words/CustomVocab/adjektiv/add";
import AddPhrase from "../../words/CustomVocab/udtryk/add";
import {AdderComponentClass, VocabEntry, VocabEntryType} from "lib/types/question";
import * as AppContext from 'lib/app_context';

type Props = {
    user: firebase.User;
} & WithTranslation

type State = {
    modalAdding?: AdderComponentClass;
    editingExistingEntry?: VocabEntry;
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

    private getAdderClass(type: VocabEntryType): AdderComponentClass | undefined {
        switch (type) {
            case 'substantiv': return AddNoun;
            case 'verbum': return AddVerbum;
            case 'adjektiv': return AddAdjektiv;
            case 'udtryk': return AddPhrase;
        }
    }

    private startAddVocab(type: VocabEntryType, vocabEntry?: VocabEntry | undefined) {
        const modalAdding = this.getAdderClass(type);

        this.setState({
            modalAdding,
            editingExistingEntry: vocabEntry,
        });
    }

    private startEditVocab(vocabEntry: VocabEntry) {
        this.startAddVocab(vocabEntry.type, vocabEntry);
    }

    private closeModal() {
        this.setState({ modalAdding: undefined });
    }

    render() {
        if (!this.state) return null;

        const { modalAdding, editingExistingEntry } = this.state;

        return (
            <div>
                <LoginBar user={this.props.user}/>
                <Workspace user={this.props.user} hidden={!!modalAdding}/>

                {modalAdding && <VocabAddDialog
                    modalAdding={this.state.modalAdding}
                    editingExistingEntry={editingExistingEntry}
                    onClose={() => this.closeModal()}
                    />}
            </div>
        )
    }
}

export default withTranslation()(LoggedInBox);
