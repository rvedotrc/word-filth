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

import {VocabEntryType, VocabEntry} from 'lib/types/question';
import * as VocabLanguage from "lib/vocab_language";
import AdjektivQuestionGenerator from "./adjektiv_question_generator";
import {decodeLang, decodeMandatoryText, decodeOptionalText, decodeTags, DecodingError} from "../decoder";
import * as Gender from "lib/gender";

export type Data = {
    lang: VocabLanguage.Type;
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

    public readonly lang: VocabLanguage.Type;
    public readonly køn: Gender.Type;
    public readonly grundForm: string;
    public readonly tForm: string;
    public readonly langForm: string;
    public readonly komparativ: string | null;
    public readonly superlativ: string | null;
    public readonly engelsk: string | null;
    public readonly tags: string[] | null;

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

        if (!!data.komparativ !== !!data.superlativ) throw new DecodingError();

        this.lang = data.lang;
        this.grundForm = data.grundForm;
        this.tForm = data.tForm;
        this.langForm = data.langForm;
        this.komparativ = data.komparativ;
        this.superlativ = data.superlativ;
        this.engelsk = data.engelsk;
        this.tags = data.tags;
    }

    get type(): VocabEntryType {
        return 'adjektiv';
    }

    encode(): any {
        return {
            lang: this.lang,
            grundForm: this.grundForm,
            tForm: this.tForm,
            langForm: this.langForm,
            komparativ: this.komparativ,
            superlativ: this.superlativ,
            engelsk: this.engelsk,
            tags: this.tags,
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
            engelskText: this.engelsk || '-',
            detaljer: detaljer,
            sortKey: this.grundForm,
            tags: this.tags,
        };
    }

    getQuestions() {
        return AdjektivQuestionGenerator.getQuestions(this);
    }

}
