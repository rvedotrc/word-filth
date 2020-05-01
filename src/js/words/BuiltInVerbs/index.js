import BuiltInVerb from './built_in_verb';
import verbList from './verb-list.json';
import GivenInfinitiveQuestion from "./GivenInfinitiveQuestion";
import VerbumGivenDanish from "./VerbumGivenDanish";
import VerbumGivenEnglish from "./VerbumGivenEnglish";

class BuiltInVerbs {

    static getAll() {
        const infinitives = {};
        verbList.verber.map(v => { infinitives[v.infinitiv] = true });

        return Object.keys(infinitives).map(infinitive => {
            const matchingVerbs = verbList.verber.filter(v => v.infinitiv === infinitive);
            return new BuiltInVerb(infinitive, matchingVerbs);
        });
    }

    static getAllQuestions() {
        const q = [];

        verbList.verber.map(verb => {
            q.push(new GivenInfinitiveQuestion(verb.infinitiv, [verb]));

            if (verb.engelsk && verb.engelsk.startsWith('to ')) {
                q.push(new VerbumGivenEnglish({
                    lang: 'da',
                    english: verb.engelsk,
                    danishAnswers: [verb.infinitiv],
                }));
            }

            const parts = (verb.engelsk || '').split(/\s*[,;]\s*/);
            parts.filter(part => part.match(/^to (\w+)( \w+)*$/)).map(part => {
                q.push(new VerbumGivenDanish({
                    lang: 'da',
                    infinitiv: verb.infinitiv,
                    englishAnswers: [part],
                }));
            });
        });

        return q;
    }

}

export default BuiltInVerbs;
