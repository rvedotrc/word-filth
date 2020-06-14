import GivenDanishQuestion from './GivenDanishQuestion';
import GivenEnglishUbestemtEntalQuestion from "./GivenEnglishUbestemtEntalQuestion";
import TextTidier from "lib/text_tidier";
import SubstantivVocabEntry from "./substantiv_vocab_entry";
import {Question} from "../types";
import GivenUbestemtEntalQuestion from "./GivenUbestemtEntalQuestion";

export default class SubstantivQuestionGenerator {

    static getQuestions(item: SubstantivVocabEntry) {
        const q: Question[] = [];

        const engelskAnswers = TextTidier.toMultiValue(item.engelsk || '');

        const ubestemtEntal = item.ubestemtEntal;

        if (ubestemtEntal) {
            engelskAnswers.map(engelskAnswer => {
                q.push(new GivenEnglishUbestemtEntalQuestion({
                    lang: item.lang || 'da',
                    engelsk: engelskAnswer,
                    answers: [ { køn: item.køn, ubestemtEntal } ],
                }));
            });

            q.push(new GivenUbestemtEntalQuestion({
                lang: item.lang || 'da',
                ubestemtEntal,
                answers: [item],
            }));
        }

        const ubestemtEntalEllerFlertal = item.ubestemtEntal || item.ubestemtFlertal;

        if (ubestemtEntalEllerFlertal) {
            q.push(new GivenDanishQuestion({
                lang: item.lang || 'da',
                køn: item.køn,
                ubestemtEntalEllerFlertal,
                answers: engelskAnswers.map(engelsk => ({engelsk})),
            }));
        }

        return q;
    }

}
