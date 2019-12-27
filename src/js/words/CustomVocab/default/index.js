class Default {

    constructor(vocabKey, data) {
        this.vocabKey = vocabKey;
        this.data = data;
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

}

export default Default;
