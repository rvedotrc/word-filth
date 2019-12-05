import BuiltinVerb from './builtin_verb';

class Questions {

    static getQuestions() {
        const all = BuiltinVerb.getQuestions();

        // Warn on consistency error
        const seenKeys = {};
        all.map(q => {
            if (seenKeys[q.resultsKey]) throw `Already seen ${q.resultsKey}`;
            seenKeys[q.resultsKey] = true;
        });

        return all;
    }

}

export default Questions;
