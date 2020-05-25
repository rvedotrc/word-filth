import verbList from './verb-list.json';
import VerbumQuestionGenerator from "../CustomVocab/verbum/verbum_question_generator";

class BuiltInVerbs {

    static getAll() {
        return verbList.verber;
    }

    static getAllQuestions() {
        return VerbumQuestionGenerator.getQuestions(verbList.verber);
    }

}

export default BuiltInVerbs;
