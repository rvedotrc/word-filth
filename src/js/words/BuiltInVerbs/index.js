import BuiltInVerb from './built_in_verb';
import verbList from './verb-list.json';
import VerbumQuestionGenerator from "./verbum_question_generator";

class BuiltInVerbs {

    static getAll() {
        const infinitives = {};
        verbList.verber.map(v => { infinitives[v.infinitiv] = true });

        return Object.keys(infinitives).map(infinitive => {
            const matchingVerbs = verbList.verber.filter(v => v.infinitiv === infinitive);
            return new BuiltInVerb(infinitive, matchingVerbs);
        });
    }

    static getAllQuestions() {
        return VerbumQuestionGenerator.getQuestions(verbList.verber);
    }

}

export default BuiltInVerbs;
