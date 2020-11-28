import * as UILanguage from "./ui_language";
import * as VocabLanguage from "./vocab_language";

declare const firebase: typeof import('firebase');

export type Settings = {
    uiLanguage: UILanguage.Type;
    vocabLanguage: VocabLanguage.Type;
    deactivateBuiltinVerbs: boolean;
    activateBabbel: boolean;
};

export const defaultSettings: Settings = {
    uiLanguage: UILanguage.defaultValue,
    vocabLanguage: VocabLanguage.defaultValue,
    deactivateBuiltinVerbs: false,
    activateBabbel: false,
};

export const decodeDB = (value: any): Settings => {
    const getBool = (field: string, defaultValue: boolean): boolean => {
        const actual = value[field];
        if (typeof actual !== 'boolean') return defaultValue;
        return actual;
    };

    const getEnum = <T>(field: string, values: T[], defaultValue: T): T => {
        const actual = value[field];
        if (values.indexOf(actual) < 0) return defaultValue;
        return actual;
    };

    return {
        uiLanguage: getEnum<UILanguage.Type>('language', UILanguage.values, UILanguage.defaultValue),
        vocabLanguage: getEnum<VocabLanguage.Type>('vocabLanguage', VocabLanguage.values, VocabLanguage.defaultValue),
        deactivateBuiltinVerbs: getBool('deactivateBuiltinVerbs', false),
        activateBabbel: getBool('activateBabbel', false),
    };
};

export class SettingsSaver {
    private readonly dbRef: firebase.database.Reference;

    constructor(user: firebase.User) {
        // FIXME: encapsulation, see also listener in Wiring
        this.dbRef = firebase.database().ref(`users/${user.uid}/settings`);
    }

    public setUILanguage(value: UILanguage.Type) {
        this.dbRef.child('language')?.set(value);
    }

    public setVocabLanguage(value: VocabLanguage.Type) {
        this.dbRef.child('vocabLanguage')?.set(value);
    }

    public setDeactivateBuiltinVerbs(value: boolean) {
        this.dbRef.child('deactivateBuiltinVerbs')?.set(value);
    }

    public setActivateBabbel(value: boolean) {
        this.dbRef.child('activateBabbel')?.set(value);
    }
}
