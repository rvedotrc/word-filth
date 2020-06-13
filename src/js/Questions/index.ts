import Babbel from '../words/Babbel';
import BuiltInVerbs from '../words/BuiltInVerbs';
import CustomVocab from '../words/CustomVocab';
import {Question} from "../words/CustomVocab/types";
import {QuestionAndResult} from "./types";

class Questions {

    private readonly db: any; // FIXME-any

    constructor(db: any) { // FIXME-any
        this.db = db;
    }

    getQuestions() {
        const all: Question[] = [];

        if (!this.getSetting('deactivateBuiltinVerbs')) {
            all.push(...BuiltInVerbs.getAllQuestions());
        }

        all.push(...new CustomVocab(this.db).getAllQuestions());

        if (this.getSetting('activateBabbel')) {
            all.push(...Babbel.getAllQuestions());
        }

        // Merge by results key
        const byResultsKey: Map<string, Question> = new Map();
        all.map(q => {
            const existing = byResultsKey.get(q.resultsKey);
            if (existing) {
                const merged = existing.merge(q);
                if (merged) {
                    byResultsKey.set(merged.resultsKey, merged);
                } else {
                    console.error("Couldn't merge questions", [q, existing]);
                }
            } else {
                byResultsKey.set(q.resultsKey, q);
            }
        });

        return Array.from(byResultsKey.values());
    }

    getQuestionsAndResults(warnOnUnrecognised?: boolean): QuestionAndResult[] {
        const results = this.db.results || {};
        const questions = this.getQuestions();

        const answer = questions.map(question => {
            return {
                question,
                result: results[question.resultsKey] || {
                    level: 0,
                    history: [],
                    nextTimestamp: null
                }
            };
        });

        const unrecognisedResultKeys = new Set(Object.keys(results));
        questions.forEach(q => unrecognisedResultKeys.delete(q.resultsKey));

        if (!this.getSetting('activateBabbel')) {
            for (const k of unrecognisedResultKeys) {
                if (k.startsWith("babbel-")) unrecognisedResultKeys.delete(k);
            }
        }

        // Warn on consistency error
        if (warnOnUnrecognised && Object.keys(unrecognisedResultKeys).length > 0) {
            console.log("Unrecognised results keys:", Object.keys(unrecognisedResultKeys).sort());
            console.log("answer = ", answer);
        }

        return answer;
    }

    getEligibleQuestions(): Question[] {
        const now = new Date().getTime();
        return this.getQuestionsAndResults()
            .filter(qr => (!qr.result.nextTimestamp || now > qr.result.nextTimestamp))
            .map(qr => qr.question);
    }

    getSetting(name: string) {
        return (this.db.settings || {})[name];
    }
}

export default Questions;
