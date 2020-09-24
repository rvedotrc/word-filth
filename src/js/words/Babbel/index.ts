import * as rawLearnedList from './babbel-more.normalised.json';

import BabbelVocabEntry from "./babbel_vocab_entry";
import {unique} from "lib/unique-by";

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

    // Apart from the final object construction we could precompute all of this tbh
    static getAllVocabEntries(): BabbelVocabEntry[] {
        const byText: Map<string, {
            id: string;
            dansk: string;
            engelsk: string;
            tags: string[];
        }> = new Map();

        learnedList.packages.forEach(pkg => {
            const packageTag = "babbel-" + pkg.name
                .toLocaleLowerCase()
                .split(/'/).join("")
                .split(/\W+/).join('-');

            pkg.learned_items.forEach(item => {
                const key = `${item.learn_language_text}\n${item.display_language_text}`;

                let entry = byText.get(key);
                if (!entry) {
                    entry = {
                        id: item.id,
                        dansk: item.learn_language_text,
                        engelsk: item.display_language_text,
                        tags: [],
                    };
                    byText.set(key, entry);
                }

                if (item.id < entry.id) entry.id = item.id;
                entry.tags.push(packageTag);
            });
        });

        return Array.from(byText.values()).map(value =>
            new BabbelVocabEntry({
                id: value.id,
                dansk: value.dansk,
                engelsk: value.engelsk,
                tags: unique(value.tags).sort(),
            })
        );
    }

}

export default Babbel;
