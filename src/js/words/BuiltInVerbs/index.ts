import * as verbList from './verb-list.json';
import VerbumVocabEntry from "../CustomVocab/verbum/verbum_vocab_entry";
import {Question} from "../CustomVocab/types";

class BuiltInVerbs {

    static getAll() {
        return verbList.verber;
    }

    private static getAllAsVocabEntries() {
        return this.getAll().map(verb => {
            return new VerbumVocabEntry(verb.id, true, {...verb, lang: "da", tags: null});
        });
    }

    static getAllQuestions() {
        const q: Question[] = [];
        this.getAllAsVocabEntries().forEach(item => q.push(...item.getQuestions()));
        return q;
    }

}

export default BuiltInVerbs;
