import {Verb} from "./types";
import {Question} from "../CustomVocab/types";

declare class BuiltInVerbs {
    static getAll(): Verb[];
    static getAllQuestions(): Question[];
}

export default BuiltInVerbs;
