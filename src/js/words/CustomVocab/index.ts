import AdjektivQuestionGenerator from "./adjektiv/adjektiv_question_generator";
import AdjektivVocabEntry from "./adjektiv/adjektiv_vocab_entry";
import SubstantivQuestionGenerator from './substantiv/substantiv_question_generator';
import SubstantivVocabEntry from './substantiv/substantiv_vocab_entry';
import UdtrykVocabEntry from './udtryk/udtryk_vocab_entry';
import UdtrykQuestionGenerator from "./udtryk/udtryk_question_generator";
import VerbumVocabEntry from "./verbum/verbum_vocab_entry";
import VerbumQuestionGenerator from "./verbum/verbum_question_generator";
import {Question, VocabEntry} from "./types";

class CustomVocab {

    private readonly vocab: any;

    constructor(db: any) {
        this.vocab = db.vocab || {};
    }

    getAll() {
        const handlers: any = {
            adjektiv: AdjektivVocabEntry,
            udtryk: UdtrykVocabEntry,
            substantiv: SubstantivVocabEntry,
            verbum: VerbumVocabEntry,
        };

        const badVocabKeys: string[] = [];

        const vocabEntries: VocabEntry[] = Object.keys(this.vocab)
            .map(vocabKey => {
                const data = this.vocab[vocabKey];
                const handler = (typeof data.type === 'string') && handlers[data.type];
                const vocabEntry: VocabEntry = (handler && handler.decode(vocabKey, data));
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
        let q: Question[] = [];
        const items = this.getAll();

        q = q.concat(
            AdjektivQuestionGenerator.getQuestions(
                items.filter(item => item.type === 'adjektiv') as AdjektivVocabEntry[]
            )
        );

        q = q.concat(
            VerbumQuestionGenerator.getQuestions(
                items.filter(item => item.type === 'verbum') as VerbumVocabEntry[]
            )
        );

        q = q.concat(
            SubstantivQuestionGenerator.getQuestions(
                items.filter(item => item.type === 'substantiv') as SubstantivVocabEntry[]
            )
        );

        q = q.concat(
            UdtrykQuestionGenerator.getQuestions(
                items.filter(item => item.type === 'udtryk') as UdtrykVocabEntry[]
            )
        );

        return q;
    }

}

export default CustomVocab;
