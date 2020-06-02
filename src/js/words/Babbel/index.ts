import * as learnedList from './learned-list.json';

import GivenDanishQuestion from "./given_danish_question";
import GivenEnglishQuestion from "./given_english_question";
import {Question} from "../CustomVocab/types";

class Babbel {

    static getAllQuestions() {
        const re = /^[a-zåæø -]+$/i;
        const list = learnedList.filter(e => e.danish.match(re) && e.english.match(re));

        const byEnglish: any = {}; // FIXME-any
        const byDanish: any = {}; // FIXME-any

        const build = (question: string, answer: string, map: any) => { // FIXME-any
            const entry = map[question] =  (map[question] || {});
            entry[answer] = (entry[answer] || 0) + 1;
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

        Object.keys(byEnglish).map(english => {
            ret.push(new GivenEnglishQuestion(english, Object.keys(byEnglish[english]).sort()));
        });

        Object.keys(byDanish).map(danish => {
            ret.push(new GivenDanishQuestion(danish, Object.keys(byDanish[danish]).sort()));
        });

        return ret;
    }
}

export default Babbel;
