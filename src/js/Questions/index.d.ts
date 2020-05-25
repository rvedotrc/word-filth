import {QuestionAndResult} from "./types";
import {Question} from "../words/CustomVocab/types";

export default Questions;

declare class Questions {

    constructor(db: any);
    getQuestionsAndResults(foo?: boolean): QuestionAndResult[];
    getEligibleQuestions(): Question[];

}
