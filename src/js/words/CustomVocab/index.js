import AdjektivQuestionGenerator from "./adjektiv/adjektiv_question_generator";
import AdjektivVocabEntry from "./adjektiv/adjektiv_vocab_entry";
import SubstantivQuestionGenerator from './substantiv/substantiv_question_generator';
import SubstantivVocabEntry from './substantiv/substantiv_vocab_entry';
import UdtrykVocabEntry from './udtryk/udtryk_vocab_entry';
import UdtrykQuestionGenerator from "./udtryk/udtryk_question_generator";
import VerbumVocabEntry from "./verbum/verbum_vocab_entry";
import VerbumQuestionGenerator from "./verbum/verbum_question_generator";

class CustomVocab {

    constructor(db) {
        this.vocab = db.vocab || {};
    }

    getAll() {
        const handlers = {
            adjektiv: AdjektivVocabEntry,
            udtryk: UdtrykVocabEntry,
            substantiv: SubstantivVocabEntry,
            verbum: VerbumVocabEntry,
        };

        const badVocabKeys = [];

        const vocabEntries = Object.keys(this.vocab)
            .map(vocabKey => {
                const data = this.vocab[vocabKey];
                const handler = handlers[data.type];
                const vocabEntry = (handler && handler.decode(vocabKey, data));
                if (!vocabEntry) badVocabKeys.push(vocabKey);
                return vocabEntry;
            })
            .filter(e => e);

        if (badVocabKeys.length > 0) {
            console.log(`Failed to load ${badVocabKeys.length} vocab keys`);
            console.debug({ badVocabKeys });
        }

        return vocabEntries;
    }

    getAllQuestions() {
        let q = [];
        const items = this.getAll();

        q = q.concat(
            AdjektivQuestionGenerator.getQuestions(
                items.filter(item => item.type === 'adjektiv')
            )
        );

        q = q.concat(
            VerbumQuestionGenerator.getQuestions(
                items.filter(item => item.type === 'verbum')
            )
        );

        q = q.concat(
            SubstantivQuestionGenerator.getQuestions(
                items.filter(item => item.type === 'substantiv')
            )
        );

        q = q.concat(
            UdtrykQuestionGenerator.getQuestions(
                items.filter(item => item.type === 'udtryk')
            )
        );

        return q;
    }

}

export default CustomVocab;
