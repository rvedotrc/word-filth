import Default from './default';
import Udtryk from './udtryk';
import Substantiv from './substantiv';
import Adjektiv from "./adjektiv";

class CustomVocab {

    constructor(db) {
        this.vocab = db.vocab || {};
        this.results = db.results || {};
    }

    getAll() {
        const handlers = {
            adjektiv: Adjektiv,
            udtryk: Udtryk,
            substantiv: Substantiv,
            // verbum: Verbum,
        };

        return Object.keys(this.vocab)
            .map(vocabKey => {
                const data = this.vocab[vocabKey];
                const handler = handlers[data.type] || Default;
                return new handler(vocabKey, data, this.results);
            });
    }

    getAllQuestions() {
        let q = [];
        this.getAll().map(item => {
            q = q.concat(item.getQuestions());
        });
        return q;
    }

}

export default CustomVocab;
