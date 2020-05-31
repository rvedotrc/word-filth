import AdjektivGivenDanish from "./AdjektivGivenDanish";
import AdjektivGivenEnglish from "./AdjektivGivenEnglish";
import AdjektivGivenGrundForm from "./AdjektivGivenGrundForm";
import TextTidier from "../../../shared/text_tidier";

import { Question } from '../types';
import AdjektivVocabEntry from "./adjektiv_vocab_entry";

export default class AdjektivQuestionGenerator {

    static getQuestions(item: AdjektivVocabEntry) {
        let q: Question[] = [];

        q.push(new AdjektivGivenGrundForm({
            lang: item.lang,
            grundForm: item.grundForm,
            engelsk: item.engelsk,
            answers: [item],
        }));

        TextTidier.toMultiValue(item.engelsk || '').map(engelsk => {
            q.push(new AdjektivGivenDanish({
                lang: item.lang,
                grundForm: item.grundForm,
                englishAnswers: [engelsk],
            }));
            q.push(new AdjektivGivenEnglish({
                lang: item.lang,
                english: engelsk,
                danishAnswers: [item.grundForm],
            }));
        });

        return q;
    }

}
