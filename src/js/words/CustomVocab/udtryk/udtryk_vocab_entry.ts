import {VocabEntryType, VocabEntry} from "../types";
import UdtrykQuestionGenerator from "./udtryk_question_generator";
import {decodeLang, decodeMandatoryText, DecodingError} from "../decoder";

export type Data = {
    lang: string;
    dansk: string;
    engelsk: string;
};

class UdtrykVocabEntry implements VocabEntry {

    public readonly vocabKey: string | null;
    public readonly lang: string;
    public readonly dansk: string;
    public readonly engelsk: string;

    static decode(vocabKey: string, data: any): UdtrykVocabEntry | undefined { // FIXME-any
        if (data?.type !== 'udtryk') return;

        try {
            const struct: Data = {
                lang: decodeLang(data, 'lang'),
                dansk: decodeMandatoryText(data, 'dansk'),
                engelsk: decodeMandatoryText(data, 'engelsk'),
            };

            return new UdtrykVocabEntry(vocabKey, struct);
        } catch (e) {
            if (e instanceof DecodingError) return;
            throw e;
        }
    }

    constructor(vocabKey: string | null, data: Data) {
        this.vocabKey = vocabKey;
        this.lang = data.lang;
        this.dansk = data.dansk;
        this.engelsk = data.engelsk;
    }

    get type(): VocabEntryType {
        return 'udtryk';
    }

    encode(): Data {
        return {
            lang: this.lang,
            dansk: this.dansk,
            engelsk: this.engelsk,
        };
    }

    getVocabRow() {
        return {
            type: this.type,
            danskText: this.dansk,
            engelskText: this.engelsk,
            detaljer: "", // TODO: null/undefined instead?
            sortKey: this.dansk,
        };
    }

    getQuestions() {
        return UdtrykQuestionGenerator.getQuestions(this);
    }

}

export default UdtrykVocabEntry;
