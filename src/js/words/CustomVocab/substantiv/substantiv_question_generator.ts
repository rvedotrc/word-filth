import GivenDanishQuestion from './GivenDanishQuestion';
import GivenEnglishUbestemtEntalQuestion from "./GivenEnglishUbestemtEntalQuestion";
import TextTidier from "lib/text_tidier";
import SubstantivVocabEntry from "./substantiv_vocab_entry";
import {Question} from "../types";
import GivenUbestemtEntalQuestion from "./GivenUbestemtEntalQuestion";

export default class SubstantivQuestionGenerator {

    static getQuestions(item: SubstantivVocabEntry) {
        const q: Question[] = [];


        const engelskAnswers = TextTidier.toMultiValue(item.engelsk);

        if (item.ubestemtEntal) {
            engelskAnswers.map(engelskAnswer => {
                q.push(new GivenEnglishUbestemtEntalQuestion({
                    lang: item.lang || 'da',
                    engelsk: engelskAnswer,
                    answers: [ { køn: item.køn, ubestemtEntal: item.ubestemtEntal } ],
                }));
            });

            q.push(new GivenUbestemtEntalQuestion({
                lang: item.lang || 'da',
                ubestemtEntal: item.ubestemtEntal,
                answers: [item],
            }));
        }

        q.push(new GivenDanishQuestion({
            lang: item.lang || 'da',
            køn: item.køn,
            ubestemtEntalEllerFlertal: item.ubestemtEntal || item.ubestemtFlertal,
            answers: engelskAnswers.map(engelsk => ({ engelsk })),
        }));

        return q;
    }

}
