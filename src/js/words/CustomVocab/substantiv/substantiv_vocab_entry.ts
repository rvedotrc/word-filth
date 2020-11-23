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

    constructor(vocabKey: string, data: Data) {
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

        console.assert(isSingleWordOrNull(this.ubestemtEntal), `assert failed for ${vocabKey}`);
        console.assert(isSingleWordOrNull(this.bestemtEntal), `assert failed for ${vocabKey}`);
        if (!!this.ubestemtEntal !== !!data.bestemtEntal) throw new DecodingError();
        console.assert(isSingleWordOrNull(this.ubestemtFlertal), `assert failed for ${vocabKey}`);
        console.assert(isSingleWordOrNull(this.bestemtFlertal), `assert failed for ${vocabKey}`);
        if (!!this.ubestemtFlertal !== !!data.bestemtFlertal) throw new DecodingError();

        if (!this.ubestemtEntal && !data.ubestemtFlertal) throw new DecodingError();

        console.assert(
            this.engelsk === null ||
            isNonEmptyListOf(
                TextTidier.toMultiValue(this.engelsk),
                Boolean
            )
        );

        console.assert(this.tags === null || isNonEmptyListOf(this.tags, isTag));
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
