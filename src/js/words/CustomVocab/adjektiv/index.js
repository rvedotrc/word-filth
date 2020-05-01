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

import AdjektivGivenDanish from "./AdjektivGivenDanish";
import AdjektivGivenEnglish from "./AdjektivGivenEnglish";
import AdjektivGivenGrundForm from "./AdjektivGivenGrundForm";
import TextTidier from "../../../shared/text_tidier";

class Adjektiv {

    static getQuestions(items) {
        let q = [];

        items.map(item => {
            q.push(new AdjektivGivenGrundForm({
                lang: item.lang,
                grundForm: item.grundForm,
                engelsk: item.engelsk,
                answers: [item],
            }));

            TextTidier.toMultiValue(item.engelsk || '').map(engelsk => {
                q.push(new AdjektivGivenDanish({
                    lang: item.lang,
                    grundForm: item.grundForm,
                    englishAnswers: [engelsk],
                }));
                q.push(new AdjektivGivenEnglish({
                    lang: item.lang,
                    english: engelsk,
                    danishAnswers: [item.grundForm],
                }));
            });
        });

        return q;
    }

    constructor(vocabKey, data) {
        this.vocabKey = vocabKey;
        this.data = data;
        this.lang = data.lang;

        // All required, all strings
        this.grundForm = data.grundForm;
        this.tForm = data.tForm;
        this.langForm = data.langForm;

        // Optional; strings; missing means "mere" / "mest"
        this.komparativ = data.komparativ;
        this.superlativ = data.superlativ;

        // Optional
        this.engelsk = data.engelsk;
    }

    getVocabRow() {
        let detaljer = `${this.grundForm}, ${this.tForm}, ${this.langForm}`;

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

}

export default Adjektiv;
