class Default {

    constructor(vocabKey, data, results) {
        this.vocabKey = vocabKey;
        this.data = data;
        this.results = results;
    }

    getVocabRow() {
        return {
            type: this.data.type,
            danskText: '?',
            engelskText: '?',
            detaljer: JSON.stringify(this.data),
            sortKey: JSON.stringify(this.data),
        };
    }

    getQuestions() {
        return [];
    }

}

export default Default;
