import BuiltinVerb from './builtin_verb';
import MyVocab from '../components/MyVocab';

class Questions {

    constructor(db) {
        this.db = db;
    }

    getQuestions() {
        const all = [];
        all.push.apply(all, BuiltinVerb.getAllQuestions());
        all.push.apply(all, new MyVocab(this.db).getAllQuestions());

        // Warn on consistency error
        const seenKeys = {};
        all.map(q => {
            if (seenKeys[q.resultsKey]) throw `Already seen ${q.resultsKey}`;
            seenKeys[q.resultsKey] = true;
        });

        return all;
    }

    getQuestionsAndResults() {
        const results = this.db.results;
        const questions = this.getQuestions();

        const unrecognisedResultKeys = {}
        Object.keys(results).map(k => unrecognisedResultKeys[k] = true);

        const answer = questions.map(question => {
            delete unrecognisedResultKeys[question.resultsKey];
            return {
                question,
                result: results[question.resultsKey] || {
                    level: 0,
                    history: [],
                    nextTimestamp: null
                }
            };
        });

        // Warn on consistency error
        if (Object.keys(unrecognisedResultKeys).length > 0) {
            console.log("Unrecognised results keys:", Object.keys(unrecognisedResultKeys).sort());
            console.log("answer = ", answer);
        }

        return answer;
    }

    getEligibleQuestions() {
        const now = new Date().getTime();
        return this.getQuestionsAndResults()
            .filter(qr => (!qr.result.nextTimestamp || now > qr.result.nextTimestamp))
            .map(qr => qr.question);
    }

}

export default Questions;
