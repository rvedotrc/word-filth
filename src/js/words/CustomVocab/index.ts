import AdjektivVocabEntry from "./adjektiv/adjektiv_vocab_entry";
import SubstantivVocabEntry from './substantiv/substantiv_vocab_entry';
import UdtrykVocabEntry from './udtryk/udtryk_vocab_entry';
import VerbumVocabEntry from "./verbum/verbum_vocab_entry";
import {VocabEntry} from "lib/types/question";

class CustomVocab {

    private readonly vocab: any; // FIXME-any

    constructor(vocabDb: any) { // FIXME-any
        this.vocab = vocabDb || {};
    }

    getAll() {
        const handlers: any = { // FIXME-any
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
            console.error(`Failed to load ${badVocabKeys.length} vocab keys`);
            console.error({ badVocabKeys });
        }

        return vocabEntries;
    }

}

export default CustomVocab;
