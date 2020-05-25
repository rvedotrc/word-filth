import GivenInfinitiveQuestion from "./GivenInfinitiveQuestion";
import VerbumGivenDanish from "./VerbumGivenDanish";
import VerbumGivenEnglish from "./VerbumGivenEnglish";
import {Question} from "../types";

interface VerbThing {
    lang: string;
    infinitiv: string;
    nutid: string[];
    datid: string[];
    førnutid: string[];
    engelsk: string;
}

export default class VerbumQuestionGenerator {

    static getQuestions(verbs: VerbThing[]) {
        const q: Question[] = [];

        verbs.map(verb => {
            q.push(new GivenInfinitiveQuestion(verb.infinitiv, [verb]));

            if (verb.engelsk && verb.engelsk.startsWith('to ')) {
                q.push(new VerbumGivenEnglish({
                    lang: verb.lang || 'da',
                    english: verb.engelsk,
                    danishAnswers: [verb.infinitiv],
                }));
            }

            const parts = (verb.engelsk || '').split(/\s*[,;]\s*/);
            parts.filter(part => part.match(/^to (\w+)( \w+)*$/)).map(part => {
                q.push(new VerbumGivenDanish({
                    lang: verb.lang || 'da',
                    infinitiv: verb.infinitiv,
                    englishAnswers: [part],
                }));
            });
        });

        return q;
    }

}
