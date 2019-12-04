import React from "react";
import VocabRow from './vocab_row';

class Substantiv {
    // Load from vocab list
    constructor(dbKey, data) {
        this.dbKey = dbKey;
        this.data = data;

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

        this.sortKey = this.ubestemtEntal || this.ubestemtFlertal;
    }

    // create/edit form

    asVocabEntry(key) {
        return React.createElement(VocabRow, { item: this, key: this.dbKey }, null);
    }

    // practice (multiple modes?)

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