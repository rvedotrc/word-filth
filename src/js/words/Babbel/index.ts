import * as rawLearnedList from './babbel-more.normalised.json';

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

}

export default Babbel;
