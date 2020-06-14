import {VocabEntryType, VocabEntry} from "../types";
import VerbumQuestionGenerator from "./verbum_question_generator";
import {decodeLang, decodeMandatoryText, decodeOptionalText, decodeStringList, DecodingError} from "../decoder";

export type Data = {
    lang: string;
    infinitiv: string;
    nutid: string[];
    datid: string[];
    førnutid: string[];
    engelsk: string | null;
};

export default class VerbumVocabEntry implements VocabEntry {

    public readonly vocabKey: string | null;
    public readonly lang: string;
    public readonly infinitiv: string;
    public readonly nutid: string[];
    public readonly datid: string[];
    public readonly førnutid: string[];
    public readonly engelsk: string | null;

    static decode(vocabKey: string, data: any): VerbumVocabEntry | undefined { // FIXME-any
        if (data?.type !== 'verbum') return;

        try {
            const struct: Data = {
                lang: decodeLang(data, 'lang'),
                infinitiv: decodeMandatoryText(data, 'infinitiv'),
                nutid: decodeStringList(data, 'nutid'),
                datid: decodeStringList(data, 'datid'),
                førnutid: decodeStringList(data, 'førnutid'),
                engelsk: decodeOptionalText(data, 'engelsk'),
            };

            return new VerbumVocabEntry(vocabKey, struct);
        } catch (e) {
            if (e instanceof DecodingError) return;
            throw e;
        }
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
        const detaljer = `${this.nutid.join('/')}, ${this.datid.join('/')}, ${this.førnutid.join('/')}`;

        return {
            type: this.type,
            danskText: this.infinitiv,
            engelskText: this.engelsk || '',
            detaljer: detaljer,
            sortKey: this.infinitiv.replace(/^(at|å) /, ''),
        };
    }

    getQuestions() {
        return VerbumQuestionGenerator.getQuestions(this);
    }

}
