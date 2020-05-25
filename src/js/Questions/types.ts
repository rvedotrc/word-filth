import {Question} from "../words/CustomVocab/types";

export interface ResultHistory {
    timestamp: number;
    isCorrect: boolean;
}

export interface Result {
    level: number;
    history: ResultHistory[];
    nextTimestamp: number | undefined;
}

export interface QuestionAndResult {
    question: Question;
    result: Result;
}
