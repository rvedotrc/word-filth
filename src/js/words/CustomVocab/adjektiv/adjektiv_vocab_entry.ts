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
    engelsk?: string;
} | {
    lang: string;
    grundForm: string;
    tForm: string;
    langForm: string;
    komparativ: null;
    superlativ: null;
    engelsk?: string;
};

export default class AdjektivVocabEntry implements VocabEntry {

    public readonly vocabKey: string | null;
    public struct: Data;

    static decode(vocabKey: string, data: any): AdjektivVocabEntry | undefined { // FIXME-any
        if (typeof data !== 'object') return;
        if (data.type !== 'adjektiv') return;
        if (data.lang !== undefined && data.lang !== 'da' && data.lang !== 'no') return;
        if (typeof data.grundForm !== 'string') return;
        if (typeof data.tForm !== 'string') return;
        if (typeof data.langForm !== 'string') return;
        if (typeof data.komparativ !== 'string' && typeof data.komparativ !== 'undefined') return;
        if (typeof data.superlativ !== 'string' && typeof data.superlativ !== 'undefined') return;
        if (typeof data.engelsk !== 'string' && typeof data.engelsk !== 'undefined') return;

        return new AdjektivVocabEntry(vocabKey, {
            lang: data.lang || 'da',
            grundForm: data.grundForm,
            tForm: data.tForm,
            langForm: data.langForm,
            komparativ: data.komparativ || undefined,
            superlativ: data.superlativ || undefined,
            engelsk: data.engelsk || undefined,
        });
    }

    constructor(vocabKey: string | null, data: Data) {
        this.vocabKey = vocabKey;
        this.struct = data;
    }

    get type() {
        return 'adjektiv';
    }

    encode(): Data {
        return this.struct;
    }

    getVocabRow() {
        let detaljer = `${this.struct.grundForm}, ${this.struct.tForm}, ${this.struct.langForm}`;

        if (this.struct.komparativ) {
            detaljer = `${detaljer}; ${this.struct.komparativ}, ${this.struct.superlativ}`;
        }

        return {
            type: this.type,
            danskText: this.struct.grundForm,
            engelskText: this.struct.engelsk || '-',
            detaljer: detaljer,
            sortKey: this.struct.grundForm,
        };
    }

    getQuestions() {
        return AdjektivQuestionGenerator.getQuestions(this);
    }

}
