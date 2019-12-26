// Like built-in
// inf, nutid, datid, førnutid
// optional engelsk

class Verbum {

    constructor(vocabKey, data, results) {
        this.vocabKey = vocabKey;
        this.data = data;
        this.results = results;

        this.infinitiv = data.infinitiv;

        // All required, all arrays
        this.nutid = data.nutid;
        this.datid = data.datid;
        this.førnutid = data.førnutid;

        // Optional
        this.engelsk = data.engelsk;
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

export default Verbum;
