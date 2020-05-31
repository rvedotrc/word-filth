import * as verbList from './verb-list.json';
import VerbumQuestionGenerator from "../CustomVocab/verbum/verbum_question_generator";
import VerbumVocabEntry from "../CustomVocab/verbum/verbum_vocab_entry";

class BuiltInVerbs {

    static getAll() {
        return verbList.verber;
    }

    static getAllAsVocabEntries() {
        return this.getAll().map(verb => {
            return new VerbumVocabEntry(null, {...verb, lang: "da"});
        });
    }

    static getAllQuestions() {
        return VerbumQuestionGenerator.getQuestions(this.getAllAsVocabEntries());
    }

}

export default BuiltInVerbs;
