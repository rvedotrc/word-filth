class Udtryk {

    constructor(vocabKey, data, results) {
        this.vocabKey = vocabKey;
        this.data = data;
        this.results = results;

        this.dansk = data.dansk;
        this.engelsk = data.engelsk;
    }

    getVocabRow() {
        return {
            type: this.data.type,
            danskText: this.dansk,
            engelskText: this.engelsk,
            detaljer: null,
            sortKey: this.dansk,
        };
    }

    getQuestions() {
        return [];
    }

}

export default Udtryk;
