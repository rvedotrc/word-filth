import * as verbList from './verb-list.json';
import VerbumVocabEntry from "../CustomVocab/verbum/verbum_vocab_entry";

class BuiltInVerbs {

    static getAll() {
        return verbList.verber;
    }

    static getAllAsVocabEntries() {
        return this.getAll().map(verb => {
            return new VerbumVocabEntry(verb.id, true, null, {...verb, lang: "da", tags: null});
        });
    }

}

export default BuiltInVerbs;
