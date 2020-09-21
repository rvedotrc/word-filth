export const expandSubstantiv = (base: string, bøjning: string) => {
    const parts = bøjning.split(/\s*,\s*/);
    if (!parts.every(part => part.match(/^(-|\.\.|)[a-zæøå]*$/))) return null;

    if (parts.length === 3) {
        return {
            ubestemtEntal: base,
            bestemtEntal: bøj(base, parts[0]),
            ubestemtFlertal: bøj(base, parts[1]),
            bestemtFlertal: bøj(base, parts[2]),
        };
    }

    if (parts.length === 1) {
        return {
            ubestemtEntal: base,
            bestemtEntal: bøj(base, parts[0]),
            ubestemtFlertal: '',
            bestemtFlertal: '',
        };
    }

    return null;
};

export const expandVerbum = (infinitiv: string, bøjning: string) => {
    // If we didn't store the infinitive with the particle too,
    // this wouldn't be necessary!
    const stem = infinitiv.replace(/^(at|å) /, '');

    if (bøjning.trim() === '2' && stem.endsWith('e')) {
        const shorterStem = stem.replace(/(\w)\1?e$/, "$1");

        return {
            nutid: stem + 'r',
            datid: shorterStem + 'te',
            førnutid: shorterStem + 't',
        };
    }

    if (bøjning.trim() === '1') return {
        nutid: stem + 'r',
        datid: stem + 'de',
        førnutid: stem + 't',
    };

    const match = bøjning.match(/^(\S+), ?(\S+), ?(\S+)$/);

    if (match) {
        return {
            nutid: bøj(stem, match[1]),
            datid:bøj(stem, match[2]),
            førnutid: bøj(stem, match[3]),
        };
    }

    return null;
};

export const expandAdjektiv = (grundForm: string, bøjning: string) => {
    let match = bøjning.match(/^(\S+), ?(\S+)$/);
    if (match) {
        return {
            grundForm: grundForm,
            tForm: bøj(grundForm, match[1]),
            langForm: bøj(grundForm, match[2]),
            komparativ: '',
            superlativ: '',
        };
    }

    match = bøjning.match(/^(\S+), ?(\S+) (\S+), ?(\S+)$/);
    if (match) {
        return {
            grundForm: grundForm,
            tForm: bøj(grundForm, match[1]),
            langForm: bøj(grundForm, match[2]),
            komparativ: bøj(grundForm, match[3]),
            superlativ: bøj(grundForm, match[4]),
        };
    }

    return null;
};

export const bøj = (base: string, spec: string): string => {
    if (spec.startsWith('-')) {
        return base + spec.substr(1);
    } else if (spec.startsWith('..')) {
        const suffix = spec.substr(2);

        for (let i=suffix.length; i>=0; --i) {
            const overlap = suffix.substr(0, i);
            const pos = base.lastIndexOf(overlap);
            if (pos >= 0) {
                return base.substr(0, pos) + suffix;
            }
        }

        throw 'bøjning fejl';
    } else {
        return spec;
    }
};
