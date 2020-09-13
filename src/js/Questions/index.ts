import Babbel from '../words/Babbel';
import BuiltInVerbs from '../words/BuiltInVerbs';
import CustomVocab from '../words/CustomVocab';
import {Question, VocabEntry} from "../words/CustomVocab/types";
import {QuestionAndResult} from "./types";

class Questions {

    private readonly db: any; // FIXME-any

    constructor(db: any) { // FIXME-any
        this.db = db;
    }

    private getVocabEntries(): VocabEntry[] {
        const vocab = new CustomVocab(this.db).getAll();

        if (!this.getSetting('deactivateBuiltinVerbs')) {
            vocab.push(...BuiltInVerbs.getAllAsVocabEntries());
        }

        const hiddenKeys = new Set<string>();
        vocab.forEach(vocabEntry => {
            if (vocabEntry.hidesVocabKey) hiddenKeys.add(vocabEntry.hidesVocabKey);
        });

        return vocab.filter(entry => !hiddenKeys.has(entry.vocabKey));
    }

    private getQuestions() {
        const all: Question[] = [];

        this.getVocabEntries().forEach(vocabEntry => {
            all.push(...vocabEntry.getQuestions());
        });

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

    public getQuestionsAndResults(warnOnUnrecognised?: boolean): QuestionAndResult[] {
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
            console.warn("Unrecognised results keys:", Object.keys(unrecognisedResultKeys).sort());
            console.warn("answer = ", answer);
        }

        return answer;
    }

    public getEligibleQuestions(): Question[] {
        const now = new Date().getTime();
        return this.getQuestionsAndResults()
            .filter(qr => (!qr.result.nextTimestamp || now > qr.result.nextTimestamp))
            .map(qr => qr.question);
    }

    private getSetting(name: string) {
        return (this.db.settings || {})[name];
    }

}

export default Questions;
