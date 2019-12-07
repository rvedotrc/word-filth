import BuiltInVerb from './built_in_verb';
import verbList from './verb-list.json';

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
        let q = [];
        this.getAll().map(item => {
            q = q.concat(item.getQuestions());
        });
        return q;
    }

}

export default BuiltInVerbs;
