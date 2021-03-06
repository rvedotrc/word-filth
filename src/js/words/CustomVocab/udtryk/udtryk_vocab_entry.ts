import {VocabEntryType, VocabEntry} from "lib/types/question";
import * as VocabLanguage from "lib/vocab_language";
import UdtrykQuestionGenerator from "./udtryk_question_generator";
import {decodeLang, decodeMandatoryText, decodeTags, DecodingError} from "../decoder";
import {isNonEmptyListOf, isTag} from "lib/validators";
import TextTidier from "lib/text_tidier";

export type Data = {
    lang: VocabLanguage.Type;
    dansk: string;
    engelsk: string;
    tags: string[] | null;
};

class UdtrykVocabEntry implements VocabEntry {

    public readonly vocabKey: string;
    public readonly readOnly: boolean = false;
    public readonly hidesVocabKey: string | null;

    public readonly lang: VocabLanguage.Type;
    public readonly dansk: string;
    public readonly engelsk: string;
    public readonly tags: string[] | null;

    static decode(vocabKey: string, data: any): UdtrykVocabEntry | undefined { // FIXME-any
        if (data?.type !== 'udtryk') return;

        const struct: Data = {
            lang: decodeLang(data, 'lang'),
            dansk: decodeMandatoryText(data, 'dansk'),
            engelsk: decodeMandatoryText(data, 'engelsk'),
            tags: decodeTags(data),
        };

        return UdtrykVocabEntry.decodeFromData(vocabKey, struct);
    }

    static decodeFromData(vocabKey: string, data: Data): UdtrykVocabEntry | undefined {
        try {
            return new UdtrykVocabEntry(vocabKey, data);
        } catch (e) {
            if (e instanceof DecodingError) return;
            throw e;
        }
    }

    constructor(vocabKey: string, data: Data) {
        if (!(
            (data.engelsk === null ||
                isNonEmptyListOf(TextTidier.toMultiValue(data.engelsk), Boolean)
            )
            && (data.engelsk === null ||
                isNonEmptyListOf(TextTidier.toMultiValue(data.dansk), Boolean)
            )
            && (data.tags === null || isNonEmptyListOf(data.tags, isTag))
        )) {
            throw new DecodingError();
        }

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
            lang: this.lang,
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
