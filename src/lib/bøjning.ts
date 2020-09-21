class Bøjning {

    expandSubstantiv(base: string, bøjning: string) {
        const parts = bøjning.split(/\s*,\s*/);
        if (!parts.every(part => this.isValidPart(part))) return null;

        if (parts.length === 3) {
            return {
                ubestemtEntal: base,
                bestemtEntal: this.bøj(base, parts[0]),
                ubestemtFlertal: this.bøj(base, parts[1]),
                bestemtFlertal: this.bøj(base, parts[2]),
            };
        }

        if (parts.length === 1) {
            return {
                ubestemtEntal: base,
                bestemtEntal: this.bøj(base, parts[0]),
                ubestemtFlertal: '',
                bestemtFlertal: '',
            };
        }

        return null;
    }

    expandVerbum(infinitiv: string, bøjning: string) {
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
                nutid: this.bøj(stem, match[1]),
                datid: this.bøj(stem, match[2]),
                førnutid: this.bøj(stem, match[3]),
            };
        }

        return null;
    }

    expandAdjektiv(grundForm: string, bøjning: string) {
        let match = bøjning.match(/^(\S+), ?(\S+)$/);
        if (match) {
            return {
                grundForm: grundForm,
                tForm: this.bøj(grundForm, match[1]),
                langForm: this.bøj(grundForm, match[2]),
                komparativ: '',
                superlativ: '',
            };
        }

        match = bøjning.match(/^(\S+), ?(\S+) (\S+), ?(\S+)$/);
        if (match) {
            return {
                grundForm: grundForm,
                tForm: this.bøj(grundForm, match[1]),
                langForm: this.bøj(grundForm, match[2]),
                komparativ: this.bøj(grundForm, match[3]),
                superlativ: this.bøj(grundForm, match[4]),
            };
        }

        return null;
    }

    isValidPart(spec: string) {
        return spec.match(/^(-|\.\.|)[a-zæøå]*$/);
    }

    bøj(base: string, spec: string) {
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
    }

}

export default Bøjning;
