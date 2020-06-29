import {VocabEntry, VocabEntryType} from "../js/words/CustomVocab/types";

export type AddFunc = (type: VocabEntryType) => void;
export type EditFunc = (vocabEntry: VocabEntry) => void;

let addFunc: AddFunc | undefined;
let editFunc: EditFunc | undefined;

export const onAddVocab = (handler: AddFunc | undefined): void => {
    addFunc = handler;
};

export const onEditVocab = (handler: EditFunc | undefined): void => {
    editFunc = handler;
};

export const startAddVocab = (type: VocabEntryType): void => {
    addFunc?.(type);
};

export const startEditVocab = (vocabEntry: VocabEntry): void => {
    editFunc?.(vocabEntry);
};

