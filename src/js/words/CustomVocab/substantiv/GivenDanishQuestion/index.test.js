import merge from 'merge';

import GivenDanishQuestion from './index';

describe(GivenDanishQuestion, () => {

    const substantiv_hund = {
        vocabKey: 'xxx',
        køn: 'en',
        ubestemtEntal: 'hund',
        bestemtEntal: 'hunden',
        ubestemtFlertal: 'hunde',
        bestemtFlertal: 'hundene',
        engelsk: 'dog',
    };

    describe('constructor', () => {
        test('simple', () => {
            const q = new GivenDanishQuestion(substantiv_hund);
            expect(q.resultsKey).toBe('vocab-xxx-GivenDansk');
            expect(q.resultsLabel).toBe('hund');
            expect(q.substantiv).toBe(substantiv_hund);
        });

        test('multiple engelsk', () => {
            const substantiv = merge(true, substantiv_hund, {engelsk: 'dog; hound'});
            const q = new GivenDanishQuestion(substantiv);
            expect(q.resultsKey).toBe('vocab-xxx-GivenDansk');
            expect(q.resultsLabel).toBe('hund');
            expect(q.substantiv).toBe(substantiv);
        });
    });

});
