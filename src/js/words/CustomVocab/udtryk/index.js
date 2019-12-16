import GivenDanish from './given_danish';
import GivenEnglish from './given_english';
import CollectionUtils from "../../../shared/collection_utils";

class Udtryk {

    static getQuestions(vocabItems) {
        const q = [];

        const byDansk = CollectionUtils.groupByString(vocabItems, item => item.dansk);
        Object.keys(byDansk).map(dansk => {
            const items = byDansk[dansk];
            const engelsk = CollectionUtils.uniqueStrings(items.map(item => item.engelsk)).sort();
            q.push(new GivenDanish(dansk, engelsk));
        });

        const byEngelsk = CollectionUtils.groupByString(vocabItems, item => item.engelsk);
        Object.keys(byEngelsk).map(engelsk => {
            const items = byEngelsk[engelsk];
            const dansk = CollectionUtils.uniqueStrings(items.map(item => item.dansk)).sort();
            q.push(new GivenEnglish(engelsk, dansk));
        });

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
