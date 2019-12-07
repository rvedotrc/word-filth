import GivenInfinitive from './GivenInfinitive';
import verbList from './verb-list.json';

class BuiltinVerb {

    static getAll() {
        const infinitives = {};
        verbList.verber.map(v => { infinitives[v.infinitiv] = true });

        return Object.keys(infinitives).map(infinitive => {
            const matchingVerbs = verbList.verber.filter(v => v.infinitiv === infinitive);
            return new BuiltinVerb(infinitive, matchingVerbs);
        });
    }

    static getAllQuestions() {
        var q = [];
        this.getAll().map(item => {
            q = q.concat(item.getQuestions());
        });
        return q;
    }

    constructor(infinitive, verbs) {
        this.infinitive = infinitive;
        this.verbs = verbs;
    }

    getQuestions() {
        return [
            new GivenInfinitive(this.infinitive, this.verbs)
        ];
    }

}

export default BuiltinVerb;
