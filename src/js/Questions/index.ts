import Babbel from '../words/Babbel';
import {Question, VocabEntry} from "../words/CustomVocab/types";
import {QuestionAndResult, Result} from "./types";
import {Settings} from "lib/settings";

class Questions {

    public static getQuestions(vocabEntries: VocabEntry[], settings: Settings) {
        const all: Question[] = [];

        vocabEntries.forEach(vocabEntry => {
            all.push(...vocabEntry.getQuestions());
        });

        if (settings.activateBabbel) {
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

        return byResultsKey;
    }

    public static getQuestionsAndResults(questionsMap: Map<string, Question>, resultsMap: Map<string, Result>): Map<string, QuestionAndResult> {
        const r: Map<string, QuestionAndResult> = new Map();

        for (const [resultsKey, question] of questionsMap.entries()) {
            const result: Result = resultsMap.get(resultsKey) || {
                level: 0,
                history: [],
                nextTimestamp: undefined
            };
            r.set(resultsKey, { question, result });
        }

        return r;

        // const unrecognisedResultKeys = new Set(Object.keys(resultsDb));
        // questions.forEach(q => unrecognisedResultKeys.delete(q.resultsKey));

        // if (!settings.activateBabbel) {
        //     for (const k of unrecognisedResultKeys) {
        //         if (k.startsWith("babbel-")) unrecognisedResultKeys.delete(k);
        //     }
        // }
        //
        // // Warn on consistency error
        // if (warnOnUnrecognised && Object.keys(unrecognisedResultKeys).length > 0) {
        //     console.warn("Unrecognised results keys:", Object.keys(unrecognisedResultKeys).sort());
        //     console.warn("answer = ", answer);
        // }
    }

    public static getEligibleQuestions(questionsAndResults: Map<string, QuestionAndResult>): Question[] {
        const now = new Date().getTime();
        return Array.from(questionsAndResults.values())
            .filter(qr => (!qr.result.nextTimestamp || now > qr.result.nextTimestamp))
            .map(qr => qr.question);
    }

}

export default Questions;
