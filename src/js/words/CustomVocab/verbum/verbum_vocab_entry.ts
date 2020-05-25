import {VocabEntry} from "../types";

export default class VerbumVocabEntry implements VocabEntry {

    public readonly lang: string;
    public readonly vocabKey: string;
    public readonly data: any;
    public readonly infinitiv: string;
    public readonly nutid: string[];
    public readonly datid: string[];
    public readonly førnutid: string[];
    public readonly engelsk: string;

    constructor(vocabKey: string, data: any) {
        this.vocabKey = vocabKey;
        this.data = data;

        this.infinitiv = data.infinitiv;
        this.lang = data.lang;

        // All required, all arrays
        this.nutid = data.nutid;
        this.datid = data.datid;
        this.førnutid = data.førnutid;

        // Optional
        this.engelsk = data.engelsk;
    }

    get type() {
        return 'verbum';
    }

    getVocabRow() {
        let detaljer = `${this.nutid.join('/')}, ${this.datid.join('/')}, ${this.førnutid.join('/')}`;

        return {
            type: this.data.type,
            danskText: this.infinitiv,
            engelskText: this.engelsk,
            detaljer: detaljer,
            sortKey: this.infinitiv,
        };
    }

}
