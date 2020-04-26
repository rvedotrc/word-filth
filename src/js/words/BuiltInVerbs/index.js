import BuiltInVerb from './built_in_verb';
import verbList from './verb-list.json';
import GivenInfinitiveQuestion from "./GivenInfinitiveQuestion";

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
        const q = [];

        verbList.verber.map(verb => {
            q.push(new GivenInfinitiveQuestion(verb.infinitiv, [verb]));
        });

        return q;
    }

}

export default BuiltInVerbs;
