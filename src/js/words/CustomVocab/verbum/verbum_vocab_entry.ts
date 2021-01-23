import {VocabEntryType, VocabEntry} from "lib/types/question";
import * as VocabLanguage from "lib/vocab_language";
import VerbumQuestionGenerator from "./verbum_question_generator";
import {
    decodeLang,
    decodeMandatoryText,
    decodeOptionalText,
    decodeStringList,
    decodeTags,
    DecodingError
} from "../decoder";
import {removeParticle} from "lib/particle";
import {isInfinitive, isNonEmptyListOf, isSingleWord, isTag} from "lib/validators";
import TextTidier from "lib/text_tidier";

export type Data = {
    lang: VocabLanguage.Type;
    infinitiv: string;
    nutid: string[];
    datid: string[];
    førnutid: string[];
    engelsk: string | null;
    tags: string[] | null;
};

export default class VerbumVocabEntry implements VocabEntry {

    public readonly vocabKey: string;
    public readonly hidesVocabKey: string | null;
    public readonly readOnly: boolean;

    public readonly lang: VocabLanguage.Type;
    public readonly infinitiv: string;
    public readonly nutid: string[];
    public readonly datid: string[];
    public readonly førnutid: string[];
    public readonly engelsk: string | null;
    public readonly tags: string[] | null;

    static decode(vocabKey: string, data: any): VerbumVocabEntry | undefined { // FIXME-any
        if (data?.type !== 'verbum') return;

        const struct: Data = {
            lang: decodeLang(data, 'lang'),
            infinitiv: decodeMandatoryText(data, 'infinitiv'),
            nutid: decodeStringList(data, 'nutid'),
            datid: decodeStringList(data, 'datid'),
            førnutid: decodeStringList(data, 'førnutid'),
            engelsk: decodeOptionalText(data, 'engelsk'),
            tags: decodeTags(data),
        };

        const hidesVocabKey = decodeOptionalText(data, 'hidesVocabKey');

        return VerbumVocabEntry.decodeFromData(vocabKey, false, hidesVocabKey, struct);
    }

    static decodeFromData(vocabKey: string, readOnly: boolean, hidesVocabKey: string | null, data: Data): VerbumVocabEntry | undefined {
        try {
            return new VerbumVocabEntry(vocabKey, readOnly, hidesVocabKey, data);
        } catch (e) {
            if (e instanceof DecodingError) return;
            throw e;
        }
    }

    constructor(vocabKey: string, readOnly: boolean, hidesVocabKey: string | null, data: Data) {
        if (!(
            isInfinitive(data.infinitiv, data.lang)
            && isNonEmptyListOf(data.nutid, isSingleWord)
            && isNonEmptyListOf(data.datid, isSingleWord)
            && isNonEmptyListOf(data.førnutid, isSingleWord)
            && (data.engelsk === null ||
                isNonEmptyListOf(TextTidier.toMultiValue(data.engelsk), Boolean)
            )
            && (data.tags === null || isNonEmptyListOf(data.tags, isTag))
        )) {
            throw new DecodingError();
        }

        this.vocabKey = vocabKey;
        this.readOnly = readOnly;
        this.hidesVocabKey = hidesVocabKey;

        this.lang = data.lang;
        this.infinitiv = data.infinitiv;
        this.nutid = data.nutid;
        this.datid = data.datid;
        this.førnutid = data.førnutid;
        this.engelsk = data.engelsk;
        this.tags = data.tags;
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
            tags: this.tags,
            hidesVocabKey: this.hidesVocabKey,
        };
    }

    getVocabRow() {
        const detaljer = `${this.nutid.join('/')}, ${this.datid.join('/')}, ${this.førnutid.join('/')}`;

        return {
            type: this.type,
            lang: this.lang,
            danskText: this.infinitiv,
            engelskText: this.engelsk || '',
            detaljer: detaljer,
            sortKey: removeParticle(this.lang, this.infinitiv),
            tags: this.tags,
        };
    }

    getQuestions() {
        return VerbumQuestionGenerator.getQuestions(this);
    }

}
