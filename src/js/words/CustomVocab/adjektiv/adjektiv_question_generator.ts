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
                lang: item.lang,
                grundForm: item.grundForm,
                engelsk: item.engelsk,
                answers: [item],
                vocabSources: [item],
            }));
        } else {
            q.push(new AdjektivGivenGrundForm({
                lang: item.lang,
                grundForm: item.grundForm,
                engelsk: item.engelsk,
                answers: [item],
                vocabSources: [item],
            }));
        }

        if (item.engelsk) {
            TextTidier.toMultiValue(item.engelsk).map(engelsk => {
                q.push(new AdjektivGivenDanish({
                    lang: item.lang,
                    grundForm: item.grundForm,
                    englishAnswers: [engelsk],
                    vocabSources: [item],
                }));
                q.push(new AdjektivGivenEnglish({
                    lang: item.lang,
                    english: engelsk,
                    danishAnswers: [item.grundForm],
                    vocabSources: [item],
                }));
            });
        }

        return q;
    }

}
