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

        // Merge by results key
        const byResultsKey = {};
        all.map(q => {
            const existing = byResultsKey[q.resultsKey];
            if (existing) {
                if (!q.merge) throw `No 'merge' for question ${existing.resultsKey}`;
                byResultsKey[q.resultsKey] = existing.merge(q);
            } else {
                byResultsKey[q.resultsKey] = q;
            }
        });

        return Object.values(byResultsKey);
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

        if (!this.getSetting('activateBabbel')) {
            Object.keys(unrecognisedResultKeys).filter(k => k.startsWith("babbel-")).map(k => delete unrecognisedResultKeys[k]);
        }

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
