import {VocabEntryType, VocabEntry} from "../CustomVocab/types";
import BabbelQuestionGenerator from "./babbel_question_generator";

class BabbelVocabEntry implements VocabEntry {

    public readonly vocabKey: string;
    public readonly readOnly: boolean = true;
    public readonly hidesVocabKey: string | null;
    public readonly lang: string;
    public readonly dansk: string;
    public readonly engelsk: string;
    public readonly tags: string[] | null;

    constructor(id: string, dansk: string, engelsk: string) {
        this.vocabKey = "babbel-" + id;
        this.lang = "da";
        this.dansk = dansk;
        this.engelsk = engelsk;
        this.tags = [];
    }

    get type(): VocabEntryType {
        return 'babbel';
    }

    encode() {
    }

    getVocabRow() {
        return {
            type: this.type,
            danskText: this.dansk,
            engelskText: this.engelsk,
            detaljer: "", // TODO: null/undefined instead?
            sortKey: this.dansk,
            tags: this.tags,
        };
    }

    getQuestions() {
        return BabbelQuestionGenerator.getQuestions(this);
    }

}

export default BabbelVocabEntry;
