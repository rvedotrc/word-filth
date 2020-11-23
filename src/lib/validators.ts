import {removeParticle} from "lib/particle";
import * as VocabLanguage from "lib/vocab_language";

export const isSingleWord = (s: string): boolean => {
    return s.match(/^[abcdefghijklmnopqrstuvwxyzæøå]+$/) !== null;
};

export const isSingleWordOrNull = (s: string | null): boolean => {
    return s === null || isSingleWord(s);
};

export const isTag = (s: string): boolean => {
    return s.match(/^[abcdefghijklmnopqrstuvwxyzæøå0123456789]+$/) !== null;
};

export const isNonEmptyListOf = <T>(list: T[], predicate: (t: T) => boolean): boolean => {
    return list.length > 0 && list.every(predicate);
};

export const isInfinitive = (s: string, lang: VocabLanguage.Type) => {
    return isSingleWord(removeParticle(lang, s));
};
