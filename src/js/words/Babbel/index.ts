import * as learnedList from './learned-list.json';

import GivenDanishQuestion from "./given_danish_question";
import GivenEnglishQuestion from "./given_english_question";
import {Question} from "../CustomVocab/types";

class Babbel {

    static getAllQuestions() {
        const re = /^[a-zåæø -]+$/i;
        const list = learnedList.filter(e => e.danish.match(re) && e.english.match(re));

        const byEnglish: Map<string, Set<string>> = new Map();
        const byDanish: Map<string, Set<string>> = new Map();

        const build = (question: string, answer: string, map: Map<string, Set<string>>) => {
            if (!map.has(question)) map.set(question, new Set());
            map.get(question).add(answer);
        };

        list.map(e => {
            const { english } = e;

            const fixedDanish = e.danish.replace(
                /^(.*) (en|et)$/,
                (_whole, substantiv, køn) => `${køn} ${substantiv}`,
            );

            const danishHasArticle = !!fixedDanish.match(/^(en|et) /);
            const englishHasArticle = !!english.match(/^(a|an) /);
            // console.log("Babbel entry", {e, danishHasArticle, englishHasArticle, fixedDanish, english});

            if (danishHasArticle) {
                if (englishHasArticle) {
                    build(fixedDanish, english, byDanish);
                    build(english, fixedDanish, byEnglish);
                } else {
                    const engelskArtikel = (
                        english.match(/^[aeiou]/)
                            ? 'an'
                            : 'a'
                    );

                    // Danish (with article) to english (without article)
                    // => also accept with article
                    build(fixedDanish, english, byDanish);
                    build(fixedDanish, engelskArtikel + " " + english, byDanish);

                    // English (without article) to Danish (with article)
                    // => indicate that article is required [TODO: clunky]
                    // The en/et indicator is added in the Question class,
                    // so that it doesn't go into the results key. Eww.
                    build(english, fixedDanish, byEnglish);
                }
            } else {
                if (englishHasArticle) {
                    console.warn("Babbel entry has english article, but not danish", e);
                }

                build(fixedDanish, english, byDanish);
                build(english, fixedDanish, byEnglish);
            }
        });

        const ret: Question[] = [];

        for (let english of byEnglish.keys()) {
            const answers = Array.from(byEnglish.get(english)).sort();
            ret.push(new GivenEnglishQuestion(english, answers));
        }

        for (let danish of byDanish.keys()) {
            const answers = Array.from(byDanish.get(danish)).sort();
            ret.push(new GivenDanishQuestion(danish, answers));
        }

        return ret;
    }
}

export default Babbel;
