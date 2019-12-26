import learnedList from './learned-list.json';

import GivenDanishQuestion from "./given_danish_question";
import GivenEnglishQuestion from "./given_english_question";

class Babbel {

    static getAllQuestions() {
        const re = /^[a-zåæø -]+$/i;
        const list = learnedList.filter(e => e.danish.match(re) && e.english.match(re));

        const byEnglish = {};
        const byDanish = {};

        const build = (question, answer, map) => {
            const entry = map[question] =  (map[question] || {});
            entry[answer] = (entry[answer] || 0) + 1;
        };

        list.map(e => {
            const { danish, english } = e;
            build(danish, english, byDanish);
            build(english, danish, byEnglish);
        });

        const ret = [];

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
