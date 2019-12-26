import GivenInfinitiveQuestion from './GivenInfinitiveQuestion';

class BuiltInVerb {

    constructor(infinitive, verbs) {
        this.infinitive = infinitive;
        this.verbs = verbs;
    }

    getQuestions() {
        return [
            new GivenInfinitiveQuestion(this.infinitive, this.verbs)
        ];
    }

}

export default BuiltInVerb;
