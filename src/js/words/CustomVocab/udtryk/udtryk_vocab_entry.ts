import {VocabEntryType, VocabEntry} from "../types";
import UdtrykQuestionGenerator from "./udtryk_question_generator";
import {decodeLang, decodeMandatoryText, decodeTags, DecodingError} from "../decoder";

export type Data = {
    lang: string;
    dansk: string;
    engelsk: string;
    tags: string[] | null;
};

class UdtrykVocabEntry implements VocabEntry {

    public readonly vocabKey: string;
    public readonly readOnly: boolean = false;
    public readonly hidesVocabKey: string | null;
    public readonly lang: string;
    public readonly dansk: string;
    public readonly engelsk: string;
    public readonly tags: string[] | null;

    static decode(vocabKey: string, data: any): UdtrykVocabEntry | undefined { // FIXME-any
        if (data?.type !== 'udtryk') return;

        try {
            const struct: Data = {
                lang: decodeLang(data, 'lang'),
                dansk: decodeMandatoryText(data, 'dansk'),
                engelsk: decodeMandatoryText(data, 'engelsk'),
                tags: decodeTags(data),
            };

            return new UdtrykVocabEntry(vocabKey, struct);
        } catch (e) {
            if (e instanceof DecodingError) return;
            throw e;
        }
    }

    constructor(vocabKey: string, data: Data) {
        this.vocabKey = vocabKey;
        this.lang = data.lang;
        this.dansk = data.dansk;
        this.engelsk = data.engelsk;
        this.tags = data.tags;
    }

    get type(): VocabEntryType {
        return 'udtryk';
    }

    encode(): Data {
        return {
            lang: this.lang,
            dansk: this.dansk,
            engelsk: this.engelsk,
            tags: this.tags,
        };
    }

    getVocabRow() {
        return {
            type: this.type,
            danskText: this.dansk,
            engelskText: this.engelsk,
            detaljer: "", // TODO: null/undefined instead?
            sortKey: this.dansk,
            tags: this.tags,
        };
    }

    getQuestions() {
        return UdtrykQuestionGenerator.getQuestions(this);
    }

}

export default UdtrykVocabEntry;
