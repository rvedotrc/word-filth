import GivenEnglishQuestion from './index';

describe(GivenEnglishQuestion, () => {

    describe('constructor', () => {
        test('simple', () => {
            const q = new GivenEnglishQuestion({
                lang: 'da',
                engelsk: 'dog',
                answers: [{ køn: 'en', ubestemt: 'hund' }],
                vocabSources: [],
            });

            expect(q.lang).toBe('da');
            expect(q.engelsk).toBe('dog');
            expect(q.answers).toStrictEqual([ { køn: 'en', ubestemt: 'hund' } ]);

            expect(q.resultsKey).toBe('lang=da:type=SubstantivE2DUE:engelsk=dog');
            expect(q.resultsLabel).toBe('dog');
            expect(q.answersLabel).toBe('en hund');

        });
    });

    // TODO: multiple answers
    // TODO: merge

});
