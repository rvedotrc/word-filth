import {VocabEntryType, VocabEntry} from "../types";
import VerbumQuestionGenerator from "./verbum_question_generator";

export type Data = {
    lang: string;
    infinitiv: string;
    nutid: string[];
    datid: string[];
    førnutid: string[];
    engelsk: string;
};

export default class VerbumVocabEntry implements VocabEntry {

    public readonly vocabKey: string | null;
    public readonly lang: string;
    public readonly infinitiv: string;
    public readonly nutid: string[];
    public readonly datid: string[];
    public readonly førnutid: string[];
    public readonly engelsk: string;

    static decode(vocabKey: string, data: any): VerbumVocabEntry | undefined { // FIXME-any
        if (typeof data !== 'object') return;
        if (data.type !== 'verbum') return;
        if (data.lang !== undefined && data.lang !== 'da' && data.lang !== 'no') return;
        if (typeof data.infinitiv !== 'string') return;
        if (!Array.isArray(data.nutid) || !data.nutid.every((e: any) => typeof e === 'string')) return; // FIXME-any
        if (!Array.isArray(data.datid) || !data.datid.every((e: any) => typeof e === 'string')) return; // FIXME-any
        if (!Array.isArray(data.førnutid) || !data.førnutid.every((e: any) => typeof e === 'string')) return; // FIXME-any
        if (typeof data.engelsk !== 'string') return;

        return new VerbumVocabEntry(vocabKey, {
            lang: data.lang || 'da',
            infinitiv: data.infinitiv,
            nutid: data.nutid,
            datid: data.datid,
            førnutid: data.førnutid,
            engelsk: data.engelsk,
        });
    }

    constructor(vocabKey: string | null, data: Data) {
        this.vocabKey = vocabKey;
        this.lang = data.lang;
        this.infinitiv = data.infinitiv;
        this.nutid = data.nutid;
        this.datid = data.datid;
        this.førnutid = data.førnutid;
        this.engelsk = data.engelsk;
    }

    get type(): VocabEntryType {
        return 'verbum';
    }

    encode(): any { // FIXME-any
        return {
            type: this.type,
            lang: this.lang,
            infinitiv: this.infinitiv,
            nutid: this.nutid,
            datid: this.datid,
            førnutid: this.førnutid,
            engelsk: this.engelsk,
        };
    }

    getVocabRow() {
        let detaljer = `${this.nutid.join('/')}, ${this.datid.join('/')}, ${this.førnutid.join('/')}`;

        return {
            type: this.type,
            danskText: this.infinitiv,
            engelskText: this.engelsk,
            detaljer: detaljer,
            sortKey: this.infinitiv.replace(/^(at|å) /, ''),
        };
    }

    getQuestions() {
        return VerbumQuestionGenerator.getQuestions(this);
    }

}
