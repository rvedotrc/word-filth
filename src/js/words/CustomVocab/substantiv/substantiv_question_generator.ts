import GivenDanishQuestion from './GivenDanishQuestion';
import GivenEnglishQuestion from "./GivenEnglishQuestion";
import TextTidier from "lib/text_tidier";
import SubstantivVocabEntry from "./substantiv_vocab_entry";
import {Question} from "lib/types/question";
import GivenUbestemtEntalQuestion from "./GivenUbestemtEntalQuestion";

export default class SubstantivQuestionGenerator {

    static getQuestions(item: SubstantivVocabEntry) {
        const q: Question<any, any>[] = [];

        const engelskAnswers = TextTidier.toMultiValue(item.engelsk || '');

        const ubestemtEntal = item.ubestemtEntal;
        const ubestemtFlertal = item.ubestemtFlertal;
        const ubestemt = ubestemtEntal || ubestemtFlertal;

        // Always true
        if (ubestemt) {
            engelskAnswers.map(engelskAnswer => {
                q.push(new GivenEnglishQuestion({
                    lang: item.lang,
                    engelsk: engelskAnswer,
                    answers: [{køn: item.køn, ubestemt}],
                    vocabSources: [item],
                }));
            });
        }

        if (ubestemtEntal) {
            q.push(new GivenUbestemtEntalQuestion({
                lang: item.lang,
                ubestemtEntal,
                answers: [item],
                vocabSources: [item],
            }));
        }

        const ubestemtEntalEllerFlertal = item.ubestemtEntal || item.ubestemtFlertal;

        if (ubestemtEntalEllerFlertal && engelskAnswers.length > 0) {
            q.push(new GivenDanishQuestion({
                lang: item.lang,
                køn: item.køn,
                ubestemtEntalEllerFlertal,
                answers: engelskAnswers.map(engelsk => ({engelsk})),
                vocabSources: [item],
            }));
        }

        return q;
    }

}
