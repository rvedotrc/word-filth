import { encode } from 'lib/results_key';
import TextTidier from "lib/text_tidier";

class DataMigrator {

    constructor(userRef) {
        this.userRef = userRef;
    }

    migrate() {
        this.userRef.once('value', snapshot => {
            const db = snapshot.val();
            if (!db) return;

            const rewritePairs = [];

            Object.keys(db.results || {}).map(oldKey => {
                let match;

                // eslint-disable-next-line no-cond-assign
                if (match = oldKey.match(/^vocab-(-\S+)-(\w+)$/)) {
                    const vocabItem = db.vocab[match[1]];
                    console.log(`Rewrite result resultType=${match[2]} vocabType=${vocabItem && vocabItem.type} key=${oldKey}`);

                    if (vocabItem && vocabItem.type === 'substantiv' && match[2] === 'GivenDansk') {
                        const newKey = `lang=${encode(vocabItem.lang || 'da')}:type=SubstantivD2E:køn=${encode(vocabItem.køn)}:dansk=${encode(vocabItem.ubestemtEntal || vocabItem.ubestemtFlertal)}`;
                        rewritePairs.push({ oldKey, newKey });
                    }

                    if (vocabItem && vocabItem.type === 'substantiv' && match[2] === 'GivenEnglishUbestemtEntal') {
                        const engelskAnswers = TextTidier.toMultiValue(vocabItem.engelsk);
                        engelskAnswers.map(engelskAnswer => {
                            const newKey = `lang=${encode(vocabItem.lang || 'da')}:type=SubstantivE2DUE:engelsk=${encode(engelskAnswer)}`;
                            rewritePairs.push({ oldKey, newKey });
                        });
                    }
                }

                // eslint-disable-next-line no-cond-assign
                if (match = oldKey.match(/^babbel-(.*) (en|et)-GivenDanish$/)) {
                    const newKey = `babbel-${match[2]} ${match[1]}-GivenDanish`;
                    rewritePairs.push({ oldKey, newKey });
                }
            });

            rewritePairs.map(({ oldKey, newKey }) => {
                const sameOldKey = rewritePairs.filter(pair => pair.oldKey === oldKey);

                if (oldKey) {
                    const sameNewKey = rewritePairs.filter(pair => pair.newKey === newKey);

                    if (sameOldKey.length === 1 && sameNewKey.length === 1 && !db.results[newKey]) {
                        console.log("Rewrite result", { oldKey, newKey });

                        this.userRef.child(`results/${newKey}`).set(db.results[oldKey])
                            .then(() => this.userRef.child(`results/${oldKey}`).remove())
                            .then(() => console.log(`Successfully rewrote ${oldKey} to ${newKey}`))
                            .catch(error => console.log(`Failed to rewrite ${oldKey} to ${newKey}:`, error));
                    } else {
                        console.log("Skipping ambiguous rewrite for", { oldKey, newKey });
                    }
                } else {
                    // reserved for "delete" migration
                }
            });
        });
    }

}

export default DataMigrator;
