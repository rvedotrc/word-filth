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

import {VocabEntry} from '../types';
import AdjektivQuestionGenerator from "./adjektiv_question_generator";

export type Data = {
    lang: string;
    grundForm: string;
    tForm: string;
    langForm: string;
    komparativ: string;
    superlativ: string;
    engelsk: string;
};

export default class AdjektivVocabEntry implements VocabEntry {

    public readonly vocabKey: string | null;
    public readonly lang: string;
    private readonly data: any; // FIXME-any

    public readonly grundForm: string;
    public readonly tForm: string;
    public readonly langForm: string;
    public readonly komparativ: string;
    public readonly superlativ: string;
    public readonly engelsk: string;

    static decode(vocabKey: string, data: any): AdjektivVocabEntry | undefined { // FIXME-any
        if (typeof data !== 'object') return;
        if (data.type !== 'adjektiv') return;
        if (data.lang !== undefined && data.lang !== 'da' && data.lang !== 'no') return;
        if (typeof data.grundForm !== 'string') return;
        if (typeof data.tForm !== 'string') return;
        if (typeof data.langForm !== 'string') return;
        if (typeof data.komparativ !== 'string' && typeof data.komparativ !== 'undefined') return;
        if (typeof data.superlativ !== 'string' && typeof data.superlativ !== 'undefined') return;
        if (typeof data.engelsk !== 'string') return;

        return new AdjektivVocabEntry(vocabKey, {
            lang: data.lang || 'da',
            grundForm: data.grundForm,
            tForm: data.tForm,
            langForm: data.langForm,
            komparativ: data.komparativ,
            superlativ: data.superlativ,
            engelsk: data.engelsk,
        });
    }

    constructor(vocabKey: string | null, data: Data) {
        this.vocabKey = vocabKey;
        this.lang = data.lang;
        this.data = data;
        this.grundForm = data.grundForm;
        this.tForm = data.tForm;
        this.langForm = data.langForm;
        this.komparativ = data.komparativ;
        this.superlativ = data.superlativ;
        this.engelsk = data.engelsk;
    }

    get type() {
        return 'adjektiv';
    }

    encode(): Data {
        return {
            lang: this.lang,
            grundForm: this.grundForm,
            tForm: this.tForm,
            langForm: this.langForm,
            komparativ: this.komparativ || null,
            superlativ: this.superlativ || null,
            engelsk: this.engelsk || null,
        };
    }

    getVocabRow() {
        let detaljer = `${this.grundForm}, ${this.tForm}, ${this.langForm}`;

        if (this.komparativ) {
            detaljer = `${detaljer}; ${this.komparativ}, ${this.superlativ}`;
        }

        return {
            type: this.type,
            danskText: this.grundForm,
            engelskText: this.engelsk,
            detaljer: detaljer,
            sortKey: this.grundForm,
        };
    }

    getQuestions() {
        return AdjektivQuestionGenerator.getQuestions(this);
    }

}
