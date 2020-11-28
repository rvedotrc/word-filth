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
                lang: verb.lang,
                english: verb.engelsk,
                danishAnswers: [verb.infinitiv],
                vocabSources: [verb],
            }));
        }

        const engelskParts = (verb.engelsk || '')
            .split(/\s*[,;]\s*/)
            .filter(part => part.match(/^to (\w+)( \w+)*$/));

        engelskParts.map(part => {
            q.push(new VerbumGivenDanish({
                lang: verb.lang,
                infinitiv: verb.infinitiv,
                englishAnswers: [part],
                vocabSources: [verb],
            }));
            q.push(new VerbumGivenEnglish({
                lang: verb.lang,
                english: part,
                danishAnswers: [verb.infinitiv],
                vocabSources: [verb],
            }));
        });

        return q;
    }

}
