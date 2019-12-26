import GivenDanish from './given_danish_question';
import GivenEnglish from './given_english_question';
// import CollectionUtils from "../../../shared/collection_utils";

class Udtryk {

    static getQuestions(vocabItems) {
        const q = [];

        const danskTilEngelsk = {};
        const engelskTilDansk = {};

        const tilføjPar = (map, q, a) => {
            map[q] = map[q] || {};
            map[q][a] = true;
        };

        vocabItems.map(item => {
            const danskSvar = item.dansk.split(/\s*;\s*/);
            const engelskSvar = item.engelsk.split(/\s*;\s*/);

            danskSvar.map(d => {
                engelskSvar.map(e => {
                    tilføjPar(danskTilEngelsk, d, e);
                    tilføjPar(engelskTilDansk, e, d);
                });
            });
        });

        const tilføjSpørgsmål = (klass, map) => {
            Object.keys(map).map(sp => {
                const muligheder = Object.keys(map[sp]);
                q.push(new klass(sp, muligheder));
            });
        };

        tilføjSpørgsmål(GivenDanish, danskTilEngelsk);
        tilføjSpørgsmål(GivenEnglish, engelskTilDansk);

        return q;
    }

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
