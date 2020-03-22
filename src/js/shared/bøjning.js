class Bøjning {

    expandSubstantiv(base, bøjning) {
        var parts = bøjning.split(/\s*,\s*/);
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

    expandVerbum(infinitiv, bøjning) {
        if (bøjning.trim() === '1') bøjning = '-r, -de, -t';

        if (bøjning.trim() === '2' && infinitiv.endsWith('e')) {
            infinitiv = infinitiv.replace(/e$/, '');
            bøjning = '-er, -te, -t';
        }

        // If we didn't store the infinitive with the particle too,
        // this wouldn't be necessary!
        let stem = infinitiv.replace(/^(at|å) /, '');
        let match = bøjning.match(/^(\S+), ?(\S+), ?(\S+)$/);

        if (match) {
            return {
                nutid: this.bøj(stem, match[1]),
                datid: this.bøj(stem, match[2]),
                førnutid: this.bøj(stem, match[3]),
            };
        }

        return null;
    }

    expandAdjektiv(grundForm, bøjning) {
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

    isValidPart(spec) {
        return spec.match(/^(-|\.\.|)[a-zæøå]*$/);
    }

    bøj(base, spec) {
        if (spec.startsWith('-')) {
            return base + spec.substr(1);
        } else if (spec.startsWith('..')) {
            const suffix = spec.substr(2);

            for (var i=suffix.length; i>=0; --i) {
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
