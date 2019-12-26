import GivenDanishQuestion from './GivenDanishQuestion';
import GivenEnglishUbestemtEntalQuestion from "./GivenEnglishUbestemtEntalQuestion";

class Substantiv {

    constructor(vocabKey, data, results) {
        this.vocabKey = vocabKey;
        this.data = data;
        this.results = results;

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

    getQuestions() {
        let q = [];
        if (this.ubestemtEntal) q.push(new GivenEnglishUbestemtEntalQuestion(this));
        // TODO: question more forms
        q.push(new GivenDanishQuestion(this));
        return q;
    }

}

export default Substantiv;
