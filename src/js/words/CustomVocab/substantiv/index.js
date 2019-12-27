import GivenDanishQuestion from './GivenDanishQuestion';
import GivenEnglishUbestemtEntalQuestion from "./GivenEnglishUbestemtEntalQuestion";

class Substantiv {

    static getQuestions(items) {
        let q = [];

        items.map(item => {
            if (item.ubestemtEntal) q.push(new GivenEnglishUbestemtEntalQuestion(item));
            // TODO: question more forms
            q.push(new GivenDanishQuestion(item));
        });

        return q;
    }

    constructor(vocabKey, data) {
        this.vocabKey = vocabKey;
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

export default Substantiv;
