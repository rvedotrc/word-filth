import GivenDanishQuestion from './GivenDanishQuestion';
import GivenEnglishUbestemtEntalQuestion from "./GivenEnglishUbestemtEntalQuestion";
import TextTidier from "../../../shared/text_tidier";
import SubstantivVocabEntry from "./substantiv_vocab_entry";
import {Question} from "../types";

export default class SubstantivQuestionGenerator {

    static getQuestions(items: SubstantivVocabEntry[]) {
        let q: Question[] = [];

        items.map(item => {
            const engelskAnswers = TextTidier.toMultiValue(item.engelsk);

            if (item.ubestemtEntal) {
                engelskAnswers.map(engelskAnswer => {
                    q.push(new GivenEnglishUbestemtEntalQuestion({
                        lang: item.lang || 'da',
                        engelsk: engelskAnswer,
                        answers: [ { køn: item.køn, ubestemtEntal: item.ubestemtEntal } ],
                    }));
                });
            }

            q.push(new GivenDanishQuestion({
                lang: item.lang || 'da',
                køn: item.køn,
                ubestemtEntalEllerFlertal: item.ubestemtEntal || item.ubestemtFlertal,
                answers: engelskAnswers.map(engelsk => ({ engelsk })),
            }));

            // TODO: question more forms
        });

        return q;
    }

}
