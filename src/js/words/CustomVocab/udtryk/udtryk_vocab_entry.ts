import GivenDanish from './given_danish_question';
import GivenEnglish from './given_english_question';
import TextTidier from '../../../shared/text_tidier';

import { VocabEntry, Question } from "../types";

class UdtrykVocabEntry implements VocabEntry {

    static getQuestions(vocabItems: UdtrykVocabEntry[]) {
        const q: Question[] = [];

        vocabItems.map(item => {
            const danskSvar = TextTidier.toMultiValue(item.dansk);
            const engelskSvar = TextTidier.toMultiValue(item.engelsk);

            danskSvar.map(d => {
                engelskSvar.map(e => {
                    q.push(new GivenDanish(
                        item.lang,
                        d,
                        [e],
                    ));
                    q.push(new GivenEnglish(
                        item.lang,
                        e,
                        [d],
                    ));
                });
            });
        });

        return q;
    }

    public readonly vocabKey: string;
    private readonly data: any;
    public readonly dansk: string;
    public readonly engelsk: string;

    constructor(vocabKey: string, data: any) {
        this.vocabKey = vocabKey;
        this.data = data;

        this.dansk = data.dansk;
        this.engelsk = data.engelsk;
    }

    get lang() {
        return this.data.lang;
    }

    getVocabRow() {
        return {
            type: this.data.type,
            danskText: this.dansk,
            engelskText: this.engelsk,
            detaljer: "", // TODO: null/undefined instead?
            sortKey: this.dansk,
        };
    }

}

export default UdtrykVocabEntry;
