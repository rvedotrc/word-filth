import AdjektivQuestionGenerator from "./adjektiv/adjektiv_question_generator";
import AdjektivVocabEntry from "./adjektiv/adjektiv_vocab_entry";
import Default from './default';
import SubstantivQuestionGenerator from './substantiv/substantiv_question_generator';
import SubstantivVocabEntry from './substantiv/substantiv_vocab_entry';
import UdtrykVocabEntry from './udtryk/udtryk_vocab_entry';
import UdtrykQuestionGenerator from "./udtryk/udtryk_question_generator";
import Verbum from "./verbum";
import VerbumQuestionGenerator from "../BuiltInVerbs/verbum_question_generator";

class CustomVocab {

    constructor(db) {
        this.vocab = db.vocab || {};
    }

    getAll() {
        const handlers = {
            adjektiv: AdjektivVocabEntry,
            udtryk: UdtrykVocabEntry,
            substantiv: SubstantivVocabEntry,
            verbum: Verbum,
        };

        return Object.keys(this.vocab)
            .map(vocabKey => {
                const data = this.vocab[vocabKey];
                const handler = handlers[data.type] || Default;
                return new handler(vocabKey, data);
            });
    }

    getAllQuestions() {
        let q = [];
        const items = this.getAll();

        q = q.concat(
            AdjektivQuestionGenerator.getQuestions(
                items.filter(item => item.data.type === 'adjektiv')
            )
        );

        q = q.concat(
            VerbumQuestionGenerator.getQuestions(
                items.filter(item => item.data.type === 'verbum')
            )
        );

        q = q.concat(
            SubstantivQuestionGenerator.getQuestions(
                items.filter(item => item.data.type === 'substantiv')
            )
        );

        q = q.concat(
            UdtrykQuestionGenerator.getQuestions(
                items.filter(item => item.data.type === 'udtryk')
            )
        );

        return q;
    }

}

export default CustomVocab;
