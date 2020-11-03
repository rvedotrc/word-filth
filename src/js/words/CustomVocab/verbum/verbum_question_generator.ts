import GivenInfinitiveQuestion from "./GivenInfinitiveQuestion";
import VerbumGivenDanish from "./VerbumGivenDanish";
import VerbumGivenEnglish from "./VerbumGivenEnglish";
import {Question} from "lib/types/question";
import VerbumVocabEntry from "./verbum_vocab_entry";

export default class VerbumQuestionGenerator {

    static getQuestions(verb: VerbumVocabEntry) {
        const q: Question<any, any>[] = [];

        q.push(new GivenInfinitiveQuestion(verb.infinitiv, [verb], [verb]));

        if (verb.engelsk && verb.engelsk.startsWith('to ')) {
            q.push(new VerbumGivenEnglish({
                lang: verb.lang || 'da',
                english: verb.engelsk,
                danishAnswers: [verb.infinitiv],
                vocabSources: [verb],
            }));
        }

        const parts = (verb.engelsk || '').split(/\s*[,;]\s*/);
        parts.filter(part => part.match(/^to (\w+)( \w+)*$/)).map(part => {
            q.push(new VerbumGivenDanish({
                lang: verb.lang || 'da',
                infinitiv: verb.infinitiv,
                englishAnswers: [part],
                vocabSources: [verb],
            }));
        });

        return q;
    }

}
