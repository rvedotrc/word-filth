import {VocabEntryType, VocabEntry} from "../types";
import SubstantivQuestionGenerator from "./substantiv_question_generator";
import {decodeKøn, decodeLang, decodeOptionalText, decodeTags, DecodingError} from "../decoder";

export type Data = {
    lang: string;
    køn: string;
    ubestemtEntal: string | null;
    bestemtEntal: string | null;
    ubestemtFlertal: string | null;
    bestemtFlertal: string | null;
    engelsk: string | null;
    tags: string[] | null;
};

export default class SubstantivVocabEntry implements VocabEntry {

    public readonly vocabKey: string | null;
    public readonly lang: string;
    public readonly køn: string;
    public readonly ubestemtEntal: string | null;
    public readonly bestemtEntal: string | null;
    public readonly ubestemtFlertal: string | null;
    public readonly bestemtFlertal: string | null;
    public readonly engelsk: string | null;
    public readonly tags: string[] | null;

    static decode(vocabKey: string, data: any): SubstantivVocabEntry | undefined { // FIXME-any
        if (data?.type !== 'substantiv') return;

        try {
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

            return new SubstantivVocabEntry(vocabKey, struct);
        } catch (e) {
            if (e instanceof DecodingError) return;
            throw e;
        }
    }

    constructor(vocabKey: string | null, data: Data) {
        this.vocabKey = vocabKey;
        this.lang = data.lang;
        this.køn = data.køn;

        if (!data.ubestemtEntal
            && !data.bestemtEntal
            && !data.ubestemtFlertal
            && !data.bestemtFlertal
        ) throw new DecodingError();

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
