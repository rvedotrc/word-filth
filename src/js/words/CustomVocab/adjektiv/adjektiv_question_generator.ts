import AdjektivGivenDanish from "./AdjektivGivenDanish";
import AdjektivGivenEnglish from "./AdjektivGivenEnglish";
import AdjektivGivenGrundForm from "./AdjektivGivenGrundForm";
import AdjektivGivenGrundFormEasy from "./AdjektivGivenGrundFormEasy";
import TextTidier from "lib/text_tidier";

import { Question } from 'lib/types/question';
import AdjektivVocabEntry from "./adjektiv_vocab_entry";

export default class AdjektivQuestionGenerator {

    static getQuestions(item: AdjektivVocabEntry) {
        const q: Question<any, any>[] = [];

        if (item.tags?.includes("easy")) {
            q.push(new AdjektivGivenGrundFormEasy({
                lang: item.struct.lang,
                grundForm: item.struct.grundForm,
                engelsk: item.struct.engelsk,
                answers: [item.struct],
                vocabSources: [item],
            }));
        } else {
            q.push(new AdjektivGivenGrundForm({
                lang: item.struct.lang,
                grundForm: item.struct.grundForm,
                engelsk: item.struct.engelsk,
                answers: [item.struct],
                vocabSources: [item],
            }));
        }

        if (item.struct.engelsk) {
            TextTidier.toMultiValue(item.struct.engelsk).map(engelsk => {
                q.push(new AdjektivGivenDanish({
                    lang: item.struct.lang,
                    grundForm: item.struct.grundForm,
                    englishAnswers: [engelsk],
                    vocabSources: [item],
                }));
                q.push(new AdjektivGivenEnglish({
                    lang: item.struct.lang,
                    english: engelsk,
                    danishAnswers: [item.struct.grundForm],
                    vocabSources: [item],
                }));
            });
        }

        return q;
    }

}
