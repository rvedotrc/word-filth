import * as UILanguage from "./ui_language";
import * as VocabLanguage from "./vocab_language";

declare const firebase: typeof import('firebase');

export type Settings = {
    uiLanguage: "en" | "da" | "no";
    vocabLanguage: "da" | "no";
    deactivateBuiltinVerbs: boolean;
    activateBabbel: boolean;
    spacedRepetitionFactor: number;
};

export const defaultSettings: Settings = {
    uiLanguage: UILanguage.defaultValue,
    vocabLanguage: VocabLanguage.defaultValue,
    deactivateBuiltinVerbs: false,
    activateBabbel: false,
    spacedRepetitionFactor: 2
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

    const getSpacedRepetitionFactor = (): number => {
        const n = Number(value.spacedRepetitionFactor);
        if (isNaN(n)) return 2.0;
        if (n < 1.1 || n > 3.0) return 2.0;
        return Math.round(n / 0.1) * 0.1;
    };

    return {
        uiLanguage: getEnum<UILanguage.Type>('language', UILanguage.values, UILanguage.defaultValue),
        vocabLanguage: getEnum<VocabLanguage.Type>('vocabLanguage', VocabLanguage.values, VocabLanguage.defaultValue),
        deactivateBuiltinVerbs: getBool('deactivateBuiltinVerbs', false),
        activateBabbel: getBool('activateBabbel', false),
        spacedRepetitionFactor: getSpacedRepetitionFactor(),
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

    public setSpacedRepetitionFactor(value: number) {
        this.dbRef.child('spacedRepetitionFactor')?.set(value);
    }
}
