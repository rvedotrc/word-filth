import GivenDanish from './given_danish_question';
import GivenEnglish from './given_english_question';
import TextTidier from 'lib/text_tidier';

import { Question } from "../types";
import UdtrykVocabEntry from "./udtryk_vocab_entry";

export default class UdtrykQuestionGenerator {

    static getQuestions(item: UdtrykVocabEntry) {
        const q: Question[] = [];

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
