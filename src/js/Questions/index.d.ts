import {QuestionAndResult} from "./types";

export default Questions;

declare class Questions {

    constructor(db: any);
    getQuestionsAndResults(foo?: boolean): QuestionAndResult[];

}
