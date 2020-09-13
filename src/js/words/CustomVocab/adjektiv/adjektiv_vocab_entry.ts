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

import {VocabEntryType, VocabEntry} from '../types';
import AdjektivQuestionGenerator from "./adjektiv_question_generator";
import {decodeLang, decodeMandatoryText, decodeOptionalText, decodeTags, DecodingError} from "../decoder";

export type Data = {
    lang: string;
    grundForm: string;
    tForm: string;
    langForm: string;
    komparativ: string | null;
    superlativ: string | null;
    engelsk: string | null;
    tags: string[] | null;
};

export default class AdjektivVocabEntry implements VocabEntry {

    public readonly vocabKey: string;
    public readonly readOnly: boolean = false;
    public readonly hidesVocabKey: string | null;
    public struct: Data;

    static decode(vocabKey: string, data: any): AdjektivVocabEntry | undefined { // FIXME-any
        if (data?.type !== 'adjektiv') return;

        try {
            const struct: Data = {
                lang: decodeLang(data, 'lang'),
                grundForm: decodeMandatoryText(data, 'grundForm'),
                tForm: decodeMandatoryText(data, 'tForm'),
                langForm: decodeMandatoryText(data, 'langForm'),
                komparativ: decodeOptionalText(data, 'komparativ'),
                superlativ: decodeOptionalText(data, 'superlativ'),
                engelsk: decodeOptionalText(data, 'engelsk'),
                tags: decodeTags(data),
            };

            return new AdjektivVocabEntry(vocabKey, struct);
        } catch (e) {
            if (e instanceof DecodingError) return;
            throw e;
        }
    }

    constructor(vocabKey: string, data: Data) {
        this.vocabKey = vocabKey;
        this.struct = data;

        if (!!data.komparativ !== !!data.superlativ) throw new DecodingError();
    }

    get type(): VocabEntryType {
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
            tags: this.struct.tags,
        };
    }

    getQuestions() {
        return AdjektivQuestionGenerator.getQuestions(this);
    }

}
