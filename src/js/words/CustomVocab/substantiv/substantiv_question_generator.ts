import GivenDanishQuestion from './GivenDanishQuestion';
import GivenEnglishQuestion from "./GivenEnglishQuestion";
import TextTidier from "lib/text_tidier";
import SubstantivVocabEntry from "./substantiv_vocab_entry";
import {Question} from "lib/types/question";
import GivenUbestemtQuestion from "./GivenUbestemtQuestion";

export default class SubstantivQuestionGenerator {

    static getQuestions(item: SubstantivVocabEntry) {
        const q: Question<any, any>[] = [];

        const engelskAnswers = TextTidier.toMultiValue(item.engelsk || '');

        const ubestemtEntal = item.ubestemtEntal;
        const ubestemtFlertal = item.ubestemtFlertal;
        const ubestemt = ubestemtEntal || ubestemtFlertal;

        // Always true, I think
        if (ubestemt) {
            engelskAnswers.map(engelskAnswer => {
                q.push(new GivenEnglishQuestion({
                    lang: item.lang,
                    engelsk: engelskAnswer,
                    answers: [{køn: item.køn, ubestemt}],
                    vocabSources: [item],
                }));
            });

            q.push(new GivenUbestemtQuestion({
                lang: item.lang,
                ubestemt,
                answers: [item],
                vocabSources: [item],
            }));

            if (engelskAnswers.length > 0) {
                q.push(new GivenDanishQuestion({
                    lang: item.lang,
                    køn: item.køn,
                    ubestemtEntalEllerFlertal: ubestemt,
                    answers: engelskAnswers.map(engelsk => ({engelsk})),
                    vocabSources: [item],
                }));
            }
        }

        return q;
    }

}
