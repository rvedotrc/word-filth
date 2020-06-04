import {VocabEntry} from "../types";
import SubstantivQuestionGenerator from "./substantiv_question_generator";

export type Data = {
    lang: string;
    køn: string;
    ubestemtEntal: string;
    bestemtEntal: string;
    ubestemtFlertal: string;
    bestemtFlertal: string;
    engelsk: string;
};

export default class SubstantivVocabEntry implements VocabEntry {

    public readonly vocabKey: string | null;
    public readonly lang: string;
    public readonly køn: string;
    public readonly ubestemtEntal: string;
    public readonly bestemtEntal: string;
    public readonly ubestemtFlertal: string;
    public readonly bestemtFlertal: string;
    public readonly engelsk: string;

    static decode(vocabKey: string, data: any): SubstantivVocabEntry | undefined { // FIXME-any
        if (typeof data !== 'object') return;
        if (data.type !== 'substantiv') return;
        if (data.lang !== undefined && data.lang !== 'da' && data.lang !== 'no') return;
        if (typeof data.køn !== 'string') return;
        if (!data.køn.match(/^(en|et|pluralis)$/)) return;
        if (typeof data.ubestemtEntal !== 'string' && typeof data.ubestemtEntal !== 'undefined') return;
        if (typeof data.bestemtEntal !== 'string' && typeof data.bestemtEntal !== 'undefined') return;
        if (typeof data.ubestemtFlertal !== 'string' && typeof data.ubestemtFlertal !== 'undefined') return;
        if (typeof data.bestemtFlertal !== 'string' && typeof data.bestemtFlertal !== 'undefined') return;
        if (typeof data.engelsk !== 'string') return;

        return new SubstantivVocabEntry(vocabKey, {
            lang: data.lang || 'da',
            køn: data.køn,
            ubestemtEntal: data.ubestemtEntal,
            bestemtEntal: data.bestemtEntal,
            ubestemtFlertal: data.ubestemtFlertal,
            bestemtFlertal: data.bestemtFlertal,
            engelsk: data.engelsk,
        });
    }

    constructor(vocabKey: string | null, data: Data) {
        this.vocabKey = vocabKey;
        this.lang = data.lang;
        this.køn = data.køn;
        this.ubestemtEntal = data.ubestemtEntal;
        this.bestemtEntal = data.bestemtEntal;
        this.ubestemtFlertal = data.ubestemtFlertal;
        this.bestemtFlertal = data.bestemtFlertal;
        this.engelsk = data.engelsk;
    }

    get type() {
        return 'substantiv';
    }

    encode(): Data {
        return {
            lang: this.lang,
            køn: this.køn,
            ubestemtEntal: this.ubestemtEntal || null,
            bestemtEntal: this.bestemtEntal || null,
            ubestemtFlertal: this.ubestemtFlertal || null,
            bestemtFlertal: this.bestemtFlertal || null,
            engelsk: this.engelsk || null,
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
            danskText: forms[0],
            engelskText: this.engelsk,
            detaljer: `${forms.join(', ')} (${this.køn})`,
            sortKey: forms[0],
        };
    }

    getQuestions() {
        return SubstantivQuestionGenerator.getQuestions(this);
    }

}
