import {Question} from "../words/CustomVocab/types";

export type ResultHistory = {
    timestamp: number;
    isCorrect: boolean;
}

export type Result = {
    level: number;
    history: ResultHistory[];
    nextTimestamp: number | undefined;
}

export type QuestionAndResult = {
    question: Question<any, any>;
    result: Result;
}
