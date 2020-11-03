import {Question, VocabEntry, QuestionAndResult, Result} from "lib/types/question";

class Questions {

    public static getQuestions(vocabEntries: VocabEntry[]) {
        const all: Question<any, any>[] = [];

        vocabEntries.forEach(vocabEntry => {
            all.push(...vocabEntry.getQuestions());
        });

        // Merge by results key
        const byResultsKey: Map<string, Question<any, any>> = new Map();

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

    public static getQuestionsAndResults(questionsMap: Map<string, Question<any, any>>, resultsMap: Map<string, Result>): Map<string, QuestionAndResult> {
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

    public static getEligibleQuestions(questionsAndResults: Map<string, QuestionAndResult>): Question<any, any>[] {
        const now = new Date().getTime();
        return Array.from(questionsAndResults.values())
            .filter(qr => (!qr.result.nextTimestamp || now > qr.result.nextTimestamp))
            .map(qr => qr.question);
    }

}

export default Questions;
