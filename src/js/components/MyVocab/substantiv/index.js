class Substantiv {

    constructor(vocabKey, data, results) {
        this.vocabKey = vocabKey;
        this.data = data;
        this.results = results;

        this.køn = data.køn;

        if (data.bøjning) {
            this.expand();
        } else {
            this.ubestemtEntal = data.ubestemtEntal;
            this.bestemtEntal = data.bestemtEntal;
            this.ubestemtFlertal = data.ubestemtFlertal;
            this.bestemtFlertal = data.bestemtFlertal;
        }

        this.engelsk = data.engelsk;
    }

    getVocabRow() {
        const forms = [
            this.ubestemtEntal,
            this.bestemtEntal,
            this.ubestemtFlertal,
            this.bestemtFlertal
        ].filter(e => e);

        return {
            type: this.data.type,
            danskText: forms[0],
            engelskText: this.engelsk,
            detaljer: `${forms.join(', ')} (${this.køn})`,
            sortKey: forms[0],
        };
    }

    getQuestions() {
        return [];
    }

    expand() {
        const bøjning = this.data.bøjning;
        this.ubestemtEntal = this.data.dansk;

        var match = bøjning.match(/^\s*(\S+),\s*(\S+),\s*(\S+)\s*$/);
        if (match) {
            this.bestemtEntal = this.bestemtEntal || this.bøj(this.ubestemtEntal, match[1]);
            this.ubestemtFlertal = this.ubestemtFlertal || this.bøj(this.ubestemtEntal, match[2]);
            this.bestemtFlertal = this.bestemtFlertal || this.bøj(this.ubestemtEntal, match[3]);
        }
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

export default Substantiv;
