export const getParticle = (lang: string) => {
    if (lang === 'da') return 'at';
    if (lang === 'no') return 'å';
    throw 'Invalid language';
};

export const removeParticle = (lang: string, s: string) => {
    if (lang === 'da') return s.replace(/^at /i, '');
    if (lang === 'no') return s.replace(/^å /i, '');
    throw 'Invalid language';
};

export const addParticle = (lang: string, s: string) => {
    const p = getParticle(lang);
    return s.toLowerCase().startsWith(p + ' ') ? s : `${p} ${s}`;
};
