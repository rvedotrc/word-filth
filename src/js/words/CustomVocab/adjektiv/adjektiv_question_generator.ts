import AdjektivGivenDanish from "./AdjektivGivenDanish";
import AdjektivGivenEnglish from "./AdjektivGivenEnglish";
import AdjektivGivenGrundForm from "./AdjektivGivenGrundForm";
import TextTidier from "../../../shared/text_tidier";

import * as stdq from '../../shared/standard_form_question';

export interface Question {
    lang: string;
    resultsKey: string;
    resultsLabel: string;
    answersLabel: string;
    createQuestionForm(props: stdq.Props): any;
}

export default class AdjektivQuestionGenerator {

    static getQuestions(items: any[]) {
        let q: Question[] = [];

        items.map(item => {
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
        });

        return q;
    }
}
