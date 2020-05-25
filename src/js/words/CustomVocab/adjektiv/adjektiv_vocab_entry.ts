// nem: -t, -me || -mere, -mest
// god: -t, -e || bedre, bedst
// lang: -t, -e || længere, længst

// adj grund
// adj -t
// adj lang
// komparativ
// superlativ

// optional engelsk

// Not all have their own kom/sup:
// mulig: -t, -e
// dvs: "mere", "mest"

import { VocabEntry } from '../types';

export default class AdjektivVocabEntry implements VocabEntry {

    public readonly vocabKey: string;
    public readonly lang: string;
    private readonly data: any;

    public readonly grundForm: string;
    public readonly tForm: string;
    public readonly langForm: string;
    public readonly komparativ: string;
    public readonly superlativ: string;
    public readonly engelsk: string;

    constructor(vocabKey: string, data: any) {
        this.vocabKey = vocabKey;
        this.lang = data.lang;
        this.data = data;

        // All required, all strings
        this.grundForm = data.grundForm;
        this.tForm = data.tForm;
        this.langForm = data.langForm;

        // Optional; strings; missing means "mere" / "mest"
        this.komparativ = data.komparativ;
        this.superlativ = data.superlativ;

        // Optional
        this.engelsk = data.engelsk;
    }

    get type() {
        return 'adjektiv';
    }

    getVocabRow() {
        let detaljer = `${this.grundForm}, ${this.tForm}, ${this.langForm}`;

        if (this.komparativ) {
            detaljer = `${detaljer}; ${this.komparativ}, ${this.superlativ}`;
        }

        return {
            type: this.data.type,
            danskText: this.grundForm,
            engelskText: this.engelsk,
            detaljer: detaljer,
            sortKey: this.grundForm,
        };
    }

}
