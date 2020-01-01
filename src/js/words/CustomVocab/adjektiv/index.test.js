import Adjektiv from './index';

describe(Adjektiv, () => {

    describe('no superlative', () => {
        const data = {
            type: 'adjektiv',
            grundForm: 'åbenbar',
            tForm: 'åbenbart',
            langForm: 'åbenbare',
            engelsk: 'apparent'
        };

        test('constructor', () => {
            const item = new Adjektiv("xxx", data);

            expect(item.vocabKey).toBe('xxx');
            expect(item.data).toBe(data);

            expect(item.grundForm).toBe('åbenbar');
            expect(item.tForm).toBe('åbenbart');
            expect(item.langForm).toBe('åbenbare');
            expect(item.engelsk).toBe('apparent');
        });

        test('getVocabRow', () => {
            const row = new Adjektiv('xxx', data).getVocabRow();

            expect(row.type).toBe('adjektiv');
            expect(row.danskText).toBe('åbenbar');
            expect(row.engelskText).toBe('apparent');
            expect(row.detaljer).toBe('åbenbart, åbenbare');
        });
    });

    describe('with superlative', () => {
        const data = {
            type: 'adjektiv',
            grundForm: 'rød',
            tForm: 'rødt',
            langForm: 'røde',
            komparativ: 'rødere',
            superlativ: 'rødest',
            engelsk: 'red'
        };

        test('constructor', () => {
            const item = new Adjektiv("xxx", data);

            expect(item.vocabKey).toBe('xxx');
            expect(item.data).toBe(data);

            expect(item.grundForm).toBe('rød');
            expect(item.tForm).toBe('rødt');
            expect(item.langForm).toBe('røde');
            expect(item.komparativ).toBe('rødere');
            expect(item.superlativ).toBe('rødest');
            expect(item.engelsk).toBe('red');
        });

        test('getVocabRow', () => {
            const row = new Adjektiv('xxx', data).getVocabRow();

            expect(row.type).toBe('adjektiv');
            expect(row.danskText).toBe('rød');
            expect(row.engelskText).toBe('red');
            expect(row.detaljer).toBe('rødt, røde; rødere, rødest');
        });
    });

});
