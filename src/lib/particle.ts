import * as VocabLanguage from "lib/vocab_language";

export const getParticle = (lang: VocabLanguage.Type) => {
    if (lang === 'da') return 'at';
    if (lang === 'no') return 'å';
    throw 'Invalid language';
};

export const removeParticle = (lang: VocabLanguage.Type, s: string) => {
    if (lang === 'da') return s.replace(/^at /i, '');
    if (lang === 'no') return s.replace(/^å /i, '');
    throw 'Invalid language';
};

export const addParticle = (lang: VocabLanguage.Type, s: string) => {
    const p = getParticle(lang);
    return s.toLowerCase().startsWith(p + ' ') ? s : `${p} ${s}`;
};
