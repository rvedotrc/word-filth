import { VocabEntry } from "../types";

export type Data = {
    lang: string;
    dansk: string;
    engelsk: string;
};

class UdtrykVocabEntry implements VocabEntry {

    public readonly vocabKey: string;
    public readonly lang: string;
    public readonly dansk: string;
    public readonly engelsk: string;

    static decode(vocabKey: string, data: any): UdtrykVocabEntry {
        if (typeof data !== 'object') return;
        if (data.type !== 'udtryk') return;
        if (data.lang !== undefined && data.lang !== 'da' && data.lang !== 'no') return;
        if (typeof data.dansk !== 'string') return;
        if (typeof data.engelsk !== 'string') return;

        return new UdtrykVocabEntry(vocabKey, {
            lang: data.lang || 'da',
            dansk: data.dansk,
            engelsk: data.engelsk,
        });
    }

    constructor(vocabKey: string, data: Data) {
        this.vocabKey = vocabKey;
        this.lang = data.lang;
        this.dansk = data.dansk;
        this.engelsk = data.engelsk;
    }

    get type() {
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

}

export default UdtrykVocabEntry;
