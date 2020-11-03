import {VocabEntryType, VocabEntry} from "lib/types/question";
import BabbelQuestionGenerator from "./babbel_question_generator";

class BabbelVocabEntry implements VocabEntry {

    public readonly vocabKey: string;
    public readonly readOnly: boolean = true;
    public readonly hidesVocabKey: string | null;
    public readonly lang: string;
    public readonly dansk: string;
    public readonly engelsk: string;
    public readonly tags: string[] | null;

    constructor(args: {id: string, dansk: string, engelsk: string, tags: string[]}) {
        this.vocabKey = "babbel-" + args.id;
        this.lang = "da";
        this.dansk = args.dansk;
        this.engelsk = args.engelsk;
        this.tags = args.tags;
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
            sortKey: this.dansk.replace(/^(en|et|at) /, ''),
            tags: this.tags,
        };
    }

    getQuestions() {
        return BabbelQuestionGenerator.getQuestions(this);
    }

}

export default BabbelVocabEntry;
