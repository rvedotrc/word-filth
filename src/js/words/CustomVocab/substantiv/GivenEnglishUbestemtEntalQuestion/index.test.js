import GivenEnglishUbestemtEntalQuestion from './index';

describe(GivenEnglishUbestemtEntalQuestion, () => {

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
            const q = new GivenEnglishUbestemtEntalQuestion(substantiv_hund);
            expect(q.resultsKey).toBe('vocab-xxx-GivenEnglishUbestemtEntal');
            expect(q.resultsLabel).toBe('dog');
            expect(q.substantiv).toBe(substantiv_hund);
        });
    });

    // TODO: multiple engelsk?

});
