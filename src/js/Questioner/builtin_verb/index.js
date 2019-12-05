import verbList from './verb-list.json';

class BuiltinVerb {

    static getQuestions() {
        const infinitives = {};
        verbList.verber.map(v => { infinitives[v.infinitiv] = true });

        return Object.keys(infinitives).map(infinitive => {
            const matchingVerbs = verbList.verber.filter(v => v.infinitiv === infinitive);
            return new BuiltinVerb(infinitive, matchingVerbs);
        });
    }

    constructor(infinitive, verbs) {
        this.infinitive =infinitive;
        this.verbs = verbs;

        this.resultsKey = infinitive.replace(/^at /, 'verb-infinitiv-');
        this.resultsLabel = infinitive;
    }

}

export default BuiltinVerb;
