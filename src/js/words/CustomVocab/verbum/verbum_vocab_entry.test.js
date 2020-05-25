import VerbumVocabEntry from './verbum_vocab_entry';

describe(VerbumVocabEntry, () => {

    describe('simple, with english', () => {
        const data = {
            type: 'verbum',
            infinitiv: 'at se',
            nutid: ['ser'],
            datid: ['så'],
            førnutid: ['set'],
            engelsk: 'to see'
        };

        test('constructor', () => {
            const item = new VerbumVocabEntry("xxx", data);

            expect(item.vocabKey).toBe('xxx');
            expect(item.data).toBe(data);

            expect(item.infinitiv).toStrictEqual('at se');
            expect(item.nutid).toStrictEqual(['ser']);
            expect(item.datid).toStrictEqual(['så']);
            expect(item.førnutid).toStrictEqual(['set']);
            expect(item.engelsk).toBe('to see');
        });

        test('getVocabRow', () => {
            const row = new VerbumVocabEntry('xxx', data).getVocabRow();

            expect(row.type).toBe('verbum');
            expect(row.danskText).toBe('at se');
            expect(row.engelskText).toBe('to see');
            expect(row.detaljer).toBe('ser, så, set');
        });
    });

    // TODO: what if engelsk is missing?

    // TODO: multiple forms

});
