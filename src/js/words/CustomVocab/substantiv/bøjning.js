class Bøjning {

    expand(base, bøjning) {
        const match = bøjning.match(/^\s*(\S+),\s*(\S+),\s*(\S+)\s*$/);
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

    bøj(base, spec) {
        if (spec.startsWith('-')) {
            return base + spec.substr(1);
        } else if (spec.startsWith('..')) {
            return 'TODO';
        } else {
            return spec;
        }
    }

}


export default Bøjning;
