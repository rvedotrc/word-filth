import {Question, VocabEntry, QuestionAndResult, Result} from "lib/types/question";

export const getQuestions = (vocabEntries: VocabEntry[]) => {
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
};

export const getQuestionsAndResults = (questionsMap: Map<string, Question<any, any>>, resultsMap: Map<string, Result>): Map<string, QuestionAndResult> => {
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
};

export const getEligibleQuestions = (questionsAndResults: Map<string, QuestionAndResult>): Question<any, any>[] => {
    const now = new Date().getTime();
    return Array.from(questionsAndResults.values())
        .filter(qr => (!qr.result.nextTimestamp || now > qr.result.nextTimestamp))
        .map(qr => qr.question);
};

export const loadResultsFromDb = (db: any): Map<string, Result> => {
    const r: Map<string, Result> = new Map();

    for (const resultsKey of Object.keys(db)) {
        const result = loadSingleResultFromDb(resultsKey, db[resultsKey]);
        if (result) r.set(resultsKey, result);
    }

    return r;
};

const loadSingleResultFromDb = (_resultsKey: string, data: any): Result | null => {
    // FIXME: validation
    return data;
};
