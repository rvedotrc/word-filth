import Babbel from '../words/Babbel';
import BuiltInVerbs from '../words/BuiltInVerbs';
import CustomVocab from '../words/CustomVocab';

class Questions {

    constructor(db) {
        this.db = db;
    }

    getQuestions() {
        const all = [];

        if (!this.getSetting('deactivateBuiltinVerbs')) {
            all.push.apply(all, BuiltInVerbs.getAllQuestions());
        }

        all.push.apply(all, new CustomVocab(this.db).getAllQuestions());

        if (this.getSetting('activateBabbel')) {
            all.push.apply(all, Babbel.getAllQuestions());
        }

        // Warn on consistency error
        const seenKeys = {};
        all.map(q => {
            if (seenKeys[q.resultsKey]) throw `Already seen ${q.resultsKey}`;
            seenKeys[q.resultsKey] = true;
        });

        return all;
    }

    getQuestionsAndResults() {
        const results = this.db.results || {};
        const questions = this.getQuestions();

        const unrecognisedResultKeys = {};
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

    getSetting(name) {
        return (this.db.settings || {})[name];
    }
}

export default Questions;
