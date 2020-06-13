import AdjektivGivenDanish from "./AdjektivGivenDanish";
import AdjektivGivenEnglish from "./AdjektivGivenEnglish";
import AdjektivGivenGrundForm from "./AdjektivGivenGrundForm";
import TextTidier from "lib/text_tidier";

import { Question } from '../types';
import AdjektivVocabEntry from "./adjektiv_vocab_entry";

export default class AdjektivQuestionGenerator {

    static getQuestions(item: AdjektivVocabEntry) {
        const q: Question[] = [];

        q.push(new AdjektivGivenGrundForm({
            lang: item.struct.lang,
            grundForm: item.struct.grundForm,
            engelsk: item.struct.engelsk,
            answers: [item.struct],
        }));

        if (item.struct.engelsk) {
            TextTidier.toMultiValue(item.struct.engelsk).map(engelsk => {
                q.push(new AdjektivGivenDanish({
                    lang: item.struct.lang,
                    grundForm: item.struct.grundForm,
                    englishAnswers: [engelsk],
                }));
                q.push(new AdjektivGivenEnglish({
                    lang: item.struct.lang,
                    english: engelsk,
                    danishAnswers: [item.struct.grundForm],
                }));
            });
        }

        return q;
    }

}
