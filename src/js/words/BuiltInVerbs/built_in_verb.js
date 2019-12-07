import GivenInfinitive from './GivenInfinitive';

class BuiltInVerb {

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

export default BuiltInVerb;
