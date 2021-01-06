import GivenDanish from './given_danish_question';
import GivenEnglish from './given_english_question';
import TextTidier from 'lib/text_tidier';

import { Question } from "lib/types/question";
import AdverbiumVocabEntry from "./adverbium_vocab_entry";

export default class AdverbiumQuestionGenerator {

    static getQuestions(item: AdverbiumVocabEntry) {
        const q: Question<any, any>[] = [];

        const danskSvar = TextTidier.toMultiValue(item.dansk);
        const engelskSvar = TextTidier.toMultiValue(item.engelsk);

        danskSvar.map(d => {
            engelskSvar.map(e => {
                q.push(new GivenDanish(
                    item.lang,
                    d,
                    [e],
                    [item],
                ));
                q.push(new GivenEnglish(
                    item.lang,
                    e,
                    [d],
                    [item],
                ));
            });
        });

        return q;
    }

}
