import learnedList from './learned-list.json';

import GivenDanish from "./given_danish";
import GivenEnglish from "./given_english";

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
            ret.push(new GivenEnglish(english, Object.keys(byEnglish[english]).sort()));
        });

        Object.keys(byDanish).map(danish => {
            ret.push(new GivenDanish(danish, Object.keys(byDanish[danish]).sort()));
        });

        return ret;
    }
}

export default Babbel;
