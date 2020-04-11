import GivenDanishQuestion from './GivenDanishQuestion';
import GivenEnglishUbestemtEntalQuestion from "./GivenEnglishUbestemtEntalQuestion";
import TextTidier from "../../../shared/text_tidier";

class Substantiv {

    static getQuestions(items) {
        let q = [];

        items.map(item => {
            const engelskAnswers = TextTidier.toMultiValue(item.engelsk);

            if (item.ubestemtEntal) {
                engelskAnswers.map(engelskAnswer => {
                    q.push(new GivenEnglishUbestemtEntalQuestion({
                        lang: item.lang || 'da',
                        engelsk: engelskAnswer,
                        answers: [ { køn: item.køn, ubestemtEntal: item.ubestemtEntal } ],
                    }));
                });
            }

            q.push(new GivenDanishQuestion({
                lang: item.lang || 'da',
                køn: item.køn,
                ubestemtEntalEllerFlertal: item.ubestemtEntal || item.ubestemtFlertal,
                answers: engelskAnswers.map(engelsk => ({ engelsk })),
            }));

            // TODO: question more forms
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
