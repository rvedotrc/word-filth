import { VocabEntry } from "../types";

class UdtrykVocabEntry implements VocabEntry {

    public readonly vocabKey: string;
    public readonly lang: string;
    private readonly data: any;

    public readonly dansk: string;
    public readonly engelsk: string;

    constructor(vocabKey: string, data: any) {
        this.vocabKey = vocabKey;
        this.lang = data.lang;
        this.data = data;

        this.dansk = data.dansk;
        this.engelsk = data.engelsk;
    }

    getVocabRow() {
        return {
            type: this.data.type,
            danskText: this.dansk,
            engelskText: this.engelsk,
            detaljer: "", // TODO: null/undefined instead?
            sortKey: this.dansk,
        };
    }

}

export default UdtrykVocabEntry;
