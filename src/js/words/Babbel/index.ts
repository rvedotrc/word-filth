import * as rawLearnedList from './babbel-more.normalised.json';

import GivenDanishQuestion from "./given_danish_question";
import GivenEnglishQuestion from "./given_english_question";
import {Question} from "../CustomVocab/types";
import BabbelVocabEntry from "./babbel_vocab_entry";

type BabbelFile = {
    packages: {
        package_id: string;
        name: string;
        learned_items: {
            id: string;
            learn_language_text: string;
            display_language_text: string;
        }[];
    }[];
}

const learnedList = rawLearnedList as any as BabbelFile;

class Babbel {

    static getAllVocabEntries(): BabbelVocabEntry[] {
        const list: BabbelVocabEntry[] = [];

        learnedList.packages.forEach(pkg => {
            pkg.learned_items.forEach(item => {
                list.push(new BabbelVocabEntry(item.id, item.learn_language_text, item.display_language_text));
            });
        });

        return list;
    }

    static getAllQuestions() {
        const re = /^[a-zåæø -]+$/i;

        const list: { danish: string; english: string; }[] = [];

        learnedList.packages.forEach(pkg => {
            pkg.learned_items.forEach(item => {
                const e = {
                    danish: item.learn_language_text,
                    english: item.display_language_text,
                };
                if (e.danish.match(re) && e.english.match(re)) {
                    list.push(e);
                }
            });
        });

        const byEnglish: Map<string, Set<string>> = new Map();
        const byDanish: Map<string, Set<string>> = new Map();

        const build = (question: string, answer: string, map: Map<string, Set<string>>) => {
            if (!map.has(question)) map.set(question, new Set());
            (map.get(question) as Set<string>).add(answer);
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

        for (const pair of byEnglish.entries()) {
            const answers = Array.from(pair[1]).sort();
            ret.push(new GivenEnglishQuestion(pair[0], answers));
        }

        for (const pair of byDanish.entries()) {
            const answers = Array.from(pair[1]).sort();
            ret.push(new GivenDanishQuestion(pair[0], answers));
        }

        return ret;
    }
}

export default Babbel;
