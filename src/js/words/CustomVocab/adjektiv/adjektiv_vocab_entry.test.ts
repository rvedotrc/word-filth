import AdjektivVocabEntry, {Data} from './adjektiv_vocab_entry';

describe(AdjektivVocabEntry, () => {

    describe('no superlative', () => {
        const data: Data = {
            lang: 'da',
            grundForm: 'åbenbar',
            tForm: 'åbenbart',
            langForm: 'åbenbare',
            engelsk: 'apparent',
            komparativ: null,
            superlativ: null,
            tags: ['foo'],
        };

        test('constructor', () => {
            const item = new AdjektivVocabEntry("xxx", data);

            expect(item.vocabKey).toBe('xxx');
            expect(item.encode()).toStrictEqual(data);

            expect(item.grundForm).toBe('åbenbar');
            expect(item.tForm).toBe('åbenbart');
            expect(item.langForm).toBe('åbenbare');
            expect(item.engelsk).toBe('apparent');
        });

        test('getVocabRow', () => {
            const row = new AdjektivVocabEntry('xxx', data).getVocabRow();

            expect(row.type).toBe('adjektiv');
            expect(row.danskText).toBe('åbenbar');
            expect(row.engelskText).toBe('apparent');
            expect(row.detaljer).toBe('åbenbar, åbenbart, åbenbare');
            expect(row.tags).toStrictEqual(['foo']);
        });
    });

    describe('with superlative', () => {
        const data: Data = {
            lang: 'da',
            grundForm: 'rød',
            tForm: 'rødt',
            langForm: 'røde',
            komparativ: 'rødere',
            superlativ: 'rødest',
            engelsk: 'red',
            tags: null,
        };

        test('constructor', () => {
            const item = new AdjektivVocabEntry("xxx", data);

            expect(item.vocabKey).toBe('xxx');
            expect(item.encode()).toStrictEqual(data);

            expect(item.grundForm).toBe('rød');
            expect(item.tForm).toBe('rødt');
            expect(item.langForm).toBe('røde');
            expect(item.komparativ).toBe('rødere');
            expect(item.superlativ).toBe('rødest');
            expect(item.engelsk).toBe('red');
        });

        test('getVocabRow', () => {
            const row = new AdjektivVocabEntry('xxx', data).getVocabRow();

            expect(row.type).toBe('adjektiv');
            expect(row.danskText).toBe('rød');
            expect(row.engelskText).toBe('red');
            expect(row.detaljer).toBe('rød, rødt, røde; rødere, rødest');
            expect(row.tags).toBeNull();
        });
    });

});
