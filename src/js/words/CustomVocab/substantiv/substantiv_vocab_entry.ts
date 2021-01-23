import {VocabEntryType, VocabEntry} from "lib/types/question";
import * as VocabLanguage from "lib/vocab_language";
import * as Gender from "lib/gender";
import SubstantivQuestionGenerator from "./substantiv_question_generator";
import {decodeKøn, decodeLang, decodeOptionalText, decodeTags, DecodingError} from "../decoder";
import {isNonEmptyListOf, isSingleWordOrNull, isTag} from "lib/validators";
import TextTidier from "lib/text_tidier";

export type Data = {
    lang: VocabLanguage.Type;
    køn: Gender.Type;
    ubestemtEntal: string | null;
    bestemtEntal: string | null;
    ubestemtFlertal: string | null;
    bestemtFlertal: string | null;
    engelsk: string | null;
    tags: string[] | null;
};

export default class SubstantivVocabEntry implements VocabEntry {

    public readonly vocabKey: string;
    public readonly readOnly: boolean = false;
    public readonly hidesVocabKey: string | null;

    public readonly lang: VocabLanguage.Type;
    public readonly køn: Gender.Type;
    public readonly ubestemtEntal: string | null;
    public readonly bestemtEntal: string | null;
    public readonly ubestemtFlertal: string | null;
    public readonly bestemtFlertal: string | null;
    public readonly engelsk: string | null;
    public readonly tags: string[] | null;

    static decode(vocabKey: string, data: any): SubstantivVocabEntry | undefined { // FIXME-any
        if (data?.type !== 'substantiv') return;

        const struct: Data = {
            lang: decodeLang(data, 'lang'),
            køn: decodeKøn(data, 'køn'),
            ubestemtEntal: decodeOptionalText(data, 'ubestemtEntal'),
            bestemtEntal: decodeOptionalText(data, 'bestemtEntal'),
            ubestemtFlertal: decodeOptionalText(data, 'ubestemtFlertal'),
            bestemtFlertal: decodeOptionalText(data, 'bestemtFlertal'),
            engelsk: decodeOptionalText(data, 'engelsk'),
            tags: decodeTags(data),
        };

        return SubstantivVocabEntry.decodeFromData(vocabKey, struct);
    }

    static decodeFromData(vocabKey: string, data: Data): SubstantivVocabEntry | undefined {
        try {
            return new SubstantivVocabEntry(vocabKey, data);
        } catch (e) {
            if (e instanceof DecodingError) return;
            throw e;
        }
    }

    constructor(vocabKey: string, data: Data) {
        if (!(
            isSingleWordOrNull(data.ubestemtEntal)
            && isSingleWordOrNull(data.bestemtEntal)
            && (!!data.ubestemtEntal === !!data.bestemtEntal)
            && isSingleWordOrNull(data.ubestemtFlertal)
            && isSingleWordOrNull(data.bestemtFlertal)
            && (!!data.ubestemtFlertal === !!data.bestemtFlertal)
            && (data.ubestemtEntal || data.ubestemtFlertal)
            && ((data.køn === 'pluralis') === (data.ubestemtEntal === null))
            && (data.engelsk === null ||
                isNonEmptyListOf(TextTidier.toMultiValue(data.engelsk), Boolean)
            )
            && (data.tags === null || isNonEmptyListOf(data.tags, isTag))
        )) {
            throw new DecodingError();
        }

        this.vocabKey = vocabKey;

        this.lang = data.lang;
        this.køn = data.køn;
        this.ubestemtEntal = data.ubestemtEntal;
        this.bestemtEntal = data.bestemtEntal;
        this.ubestemtFlertal = data.ubestemtFlertal;
        this.bestemtFlertal = data.bestemtFlertal;
        this.engelsk = data.engelsk;
        this.tags = data.tags;
    }

    get type(): VocabEntryType {
        return 'substantiv';
    }

    encode(): any {
        return {
            lang: this.lang,
            køn: this.køn,
            ubestemtEntal: this.ubestemtEntal || null,
            bestemtEntal: this.bestemtEntal || null,
            ubestemtFlertal: this.ubestemtFlertal || null,
            bestemtFlertal: this.bestemtFlertal || null,
            engelsk: this.engelsk || null,
            tags: this.tags,
        };
    }

    getVocabRow() {
        const forms = [
            this.ubestemtEntal,
            this.bestemtEntal,
            this.ubestemtFlertal,
            this.bestemtFlertal
        ].filter(e => e);

        return {
            type: this.type,
            lang: this.lang,
            danskText: forms[0] || '',
            engelskText: this.engelsk || '',
            detaljer: `${forms.join(', ')} (${this.køn})`,
            sortKey: forms[0] || '',
            tags: this.tags,
        };
    }

    getQuestions() {
        return SubstantivQuestionGenerator.getQuestions(this);
    }

}
