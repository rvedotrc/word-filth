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
    private readonly data: any;
    public readonly lang: string;
    private readonly grundForm: string;
    private readonly tForm: string;
    private readonly langForm: string;
    private readonly komparativ: string;
    private readonly superlativ: string;
    private readonly engelsk: string;

    constructor(vocabKey: string, data: any) {
        this.vocabKey = vocabKey;
        this.data = data;
        this.lang = data.lang;

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
