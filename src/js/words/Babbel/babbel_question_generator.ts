import {Question} from "../CustomVocab/types";
import BabbelVocabEntry from "./babbel_vocab_entry";
import GivenEnglishQuestion from "./given_english_question";
import GivenDanishQuestion from "./given_danish_question";

export default class BabbelQuestionGenerator {

    static getQuestions(item: BabbelVocabEntry): Question<any, any>[] {
        const re = /^[a-zåæø -]+$/i;

        if (item.dansk.match(re) && item.engelsk.match(re)) {
            return this.wordOrPhaseQuestions(item);
        }

        return [];
    }

    static wordOrPhaseQuestions(item: BabbelVocabEntry): Question<any, any>[] {
        const q: Question<any, any>[] = [];

        const english = item.engelsk;

        const fixedDanish = item.dansk.replace(
            /^(.*) (en|et)$/,
            (_whole, substantiv, køn) => `${køn} ${substantiv}`,
        );

        const danishHasArticle = !!fixedDanish.match(/^(en|et) /);
        const englishHasArticle = !!english.match(/^(a|an) /);
        // console.log("Babbel entry", {e, danishHasArticle, englishHasArticle, fixedDanish, english});

        if (danishHasArticle) {
            if (englishHasArticle) {
                q.push(new GivenEnglishQuestion(english, [fixedDanish], [item]));
                q.push(new GivenDanishQuestion(fixedDanish, [english], [item]));
            } else {
                const engelskArtikel = (
                    english.match(/^[aeiou]/)
                        ? 'an'
                        : 'a'
                );

                // Danish (with article) to english (without article)
                // => also accept with article
                q.push(new GivenDanishQuestion(fixedDanish, [english, engelskArtikel + " " + english], [item]));

                // English (without article) to Danish (with article)
                // => indicate that article is required [TODO: clunky]
                // The en/et indicator is added in the Question class,
                // so that it doesn't go into the results key. Eww.
                q.push(new GivenEnglishQuestion(english, [fixedDanish], [item]));
            }
        } else {
            if (englishHasArticle) {
                console.warn("Babbel entry has english article, but not danish", item);
            }

            q.push(new GivenEnglishQuestion(english, [fixedDanish], [item]));
            q.push(new GivenDanishQuestion(fixedDanish, [english], [item]));
        }

        return q;
    }

}
