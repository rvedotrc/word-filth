class Bøjning {

    expandSubstantiv(base, bøjning) {
        const match = bøjning.match(/^(\S+), ?(\S+), ?(\S+)$/);
        if (match) {
            return {
                ubestemtEntal: base,
                bestemtEntal: this.bøj(base, match[1]),
                ubestemtFlertal: this.bøj(base, match[2]),
                bestemtFlertal: this.bøj(base, match[3]),
            };
        }

        return null;
    }

    expandVerbum(infinitiv, bøjning) {
        let stem = infinitiv.replace(/^at /, '');
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
