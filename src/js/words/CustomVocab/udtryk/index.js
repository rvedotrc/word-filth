import GivenDanish from './given_danish';
import GivenEnglish from './given_english';

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
        return [
            new GivenEnglish(this),
            new GivenDanish(this),
        ];
    }

}

export default Udtryk;
