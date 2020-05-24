export default class SubstantivVocabEntry {

    public readonly vocabKey: string;
    public readonly lang: string;
    private readonly data: any;

    public readonly køn: string;
    public readonly ubestemtEntal: string;
    public readonly bestemtEntal: string;
    public readonly ubestemtFlertal: string;
    public readonly bestemtFlertal: string;
    public readonly engelsk: string;

    constructor(vocabKey: string, data: any) {
        this.vocabKey = vocabKey;
        this.lang = data.lang;
        this.data = data;

        this.køn = data.køn;
        this.ubestemtEntal = data.ubestemtEntal;
        this.bestemtEntal = data.bestemtEntal;
        this.ubestemtFlertal = data.ubestemtFlertal;
        this.bestemtFlertal = data.bestemtFlertal;

        this.engelsk = data.engelsk;
    }

    getVocabRow() {
        const forms = [
            this.ubestemtEntal,
            this.bestemtEntal,
            this.ubestemtFlertal,
            this.bestemtFlertal
        ].filter(e => e);

        return {
            type: this.data.type,
            danskText: forms[0],
            engelskText: this.engelsk,
            detaljer: `${forms.join(', ')} (${this.køn})`,
            sortKey: forms[0],
        };
    }

}
