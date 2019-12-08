// nem: -t, -me || -mere, -mest
// god: -t, -e || bedre, bedst
// lang: -t, -e || længere, længst

// adj grund
// adj -t
// adj lang
// komparativ
// superlativ

// optional engelsk

// Not all have their own kom/sup:
// mulig: -t, -e
// dvs: "mere", "mest"

class Adjektiv {

    constructor(vocabKey, data, results) {
        this.vocabKey = vocabKey;
        this.data = data;
        this.results = results;

        // All required
        this.grundForm = data.grundForm;
        this.tForm = data.tForm;
        this.langForm = data.langForm;

        // Optional; missing means "mere" / "mest"
        this.komparativ = data.komparativ;
        this.superlativ = data.superlativ;

        // Optional
        this.engelsk = data.engelsk;
    }

    getVocabRow() {
        let detaljer = `${this.tForm}, ${this.langForm}`;

        if (this.komparativ) {
            detaljer = `${detaljer}; ${this.komparativ}, ${this.superlativ}`;
        }

        return {
            type: this.data.type,
            danskText: this.grundForm,
            engelskText: this.engelsk,
            detaljer: detaljer,
            sortKey: this.grundForm,
        };
    }

    getQuestions() {
        let q = [];
        // TODO: questions from adjectives
        return q;
    }

}

export default Adjektiv;
