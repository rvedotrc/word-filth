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

        test('pluralis', () => {
            const q = new GivenEnglishQuestion({
                lang: 'da',
                engelsk: 'money',
                answers: [{ køn: 'pluralis', ubestemt: 'penge' }],
                vocabSources: [],
            });

            expect(q.lang).toBe('da');
            expect(q.engelsk).toBe('money');
            expect(q.answers).toStrictEqual([ { køn: 'pluralis', ubestemt: 'penge' } ]);

            expect(q.resultsKey).toBe('lang=da:type=SubstantivE2DUE:engelsk=money');
            expect(q.resultsLabel).toBe('money');
            expect(q.answersLabel).toBe('penge');
        });
    });

    // TODO: multiple answers
    // TODO: merge

});
