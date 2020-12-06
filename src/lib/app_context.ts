import {Question, VocabEntry, VocabEntryType} from "./types/question";

import {Observable} from "lib/observer";
import {QuestionAndResult, Result} from "lib/types/question";
import {defaultSettings, Settings} from "lib/settings";
import * as UILanguage from "lib/ui_language";

declare const firebase: typeof import('firebase');

export type AddFunc = (type: VocabEntryType) => void;
export type EditFunc = (vocabKey: string) => void;

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

export const startEditVocab = (vocabKey: string): void => {
    editFunc?.(vocabKey);
};

export const currentUser = new Observable<firebase.User | null>(null);
export const currentUILanguage = new Observable<UILanguage.Type>(UILanguage.defaultValue);
export const currentSettings = new Observable<Settings>(defaultSettings);
export const currentCustomVocab = new Observable<VocabEntry[]>([]);
export const currentAllVocab = new Observable<VocabEntry[]>([]);
export const currentQuestions = new Observable<Map<string, Question<any, any>>>(new Map());
export const currentResults = new Observable<Map<string, Result>>(new Map());
export const currentQuestionsAndResults = new Observable<Map<string, QuestionAndResult>>(new Map());
