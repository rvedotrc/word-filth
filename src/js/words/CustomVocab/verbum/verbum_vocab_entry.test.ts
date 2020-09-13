import VerbumVocabEntry from './verbum_vocab_entry';

describe(VerbumVocabEntry, () => {

    describe('simple, with english', () => {
        const data = {
            type: 'verbum',
            lang: 'da',
            infinitiv: 'at se',
            nutid: ['ser'],
            datid: ['så'],
            førnutid: ['set'],
            engelsk: 'to see',
            tags: ['foo'],
            hidesVocabKey: null,
        };

        test('decode', () => {
            const item = VerbumVocabEntry.decode("xxx", data);

            expect(item?.vocabKey).toBe('xxx');
            expect(item?.lang).toBe('da');
            expect(item?.infinitiv).toStrictEqual('at se');
            expect(item?.nutid).toStrictEqual(['ser']);
            expect(item?.datid).toStrictEqual(['så']);
            expect(item?.førnutid).toStrictEqual(['set']);
            expect(item?.engelsk).toBe('to see');
            expect(item?.tags).toStrictEqual(['foo']);
        });

        test('constructor', () => {
            const item = new VerbumVocabEntry("xxx", false, data);

            expect(item?.vocabKey).toBe('xxx');
            expect(item?.lang).toBe('da');
            expect(item?.infinitiv).toStrictEqual('at se');
            expect(item?.nutid).toStrictEqual(['ser']);
            expect(item?.datid).toStrictEqual(['så']);
            expect(item?.førnutid).toStrictEqual(['set']);
            expect(item?.engelsk).toBe('to see');
            expect(item?.tags).toStrictEqual(['foo']);
        });

        test('getVocabRow', () => {
            const row = new VerbumVocabEntry('xxx', false, data).getVocabRow();

            expect(row.type).toBe('verbum');
            expect(row.danskText).toBe('at se');
            expect(row.engelskText).toBe('to see');
            expect(row.detaljer).toBe('ser, så, set');
            expect(row.sortKey).toBe('se');
            expect(row.tags).toStrictEqual(['foo']);
        });
    });

    // TODO: what if engelsk is missing?

    // TODO: multiple forms

});
