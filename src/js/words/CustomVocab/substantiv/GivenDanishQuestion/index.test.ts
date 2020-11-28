import GivenDanishQuestion from './index';

describe(GivenDanishQuestion, () => {

    describe('constructor', () => {
        test('simple', () => {
            const q = new GivenDanishQuestion({
                lang: 'da',
                køn: 'en',
                ubestemtEntalEllerFlertal: 'hund',
                answers: [ { engelsk: 'dog' } ],
                vocabSources: [],
            });

            expect(q.lang).toBe('da');
            expect(q.køn).toBe('en');
            expect(q.ubestemtEntalEllerFlertal).toBe('hund');
            expect(q.answers).toStrictEqual([ { engelsk: 'dog'} ]);

            expect(q.resultsKey).toBe('lang=da:type=SubstantivD2E:køn=en:dansk=hund');
            expect(q.resultsLabel).toBe('en hund');
            expect(q.answersLabel).toBe('dog');
        });

        test('multiple answers', () => {
            // const substantiv = merge(true, substantiv_hund, {engelsk: 'dog; hound'});
            const q = new GivenDanishQuestion({
                lang: 'da',
                køn: 'en',
                ubestemtEntalEllerFlertal: 'hund',
                answers: [ { engelsk: 'dog' }, { engelsk: 'hound' } ],
                vocabSources: [],
            });

            expect(q.lang).toBe('da');
            expect(q.køn).toBe('en');
            expect(q.ubestemtEntalEllerFlertal).toBe('hund');
            expect(q.answers).toStrictEqual([ { engelsk: 'dog'}, { engelsk: 'hound' } ]);

            expect(q.resultsKey).toBe('lang=da:type=SubstantivD2E:køn=en:dansk=hund');
            expect(q.resultsLabel).toBe('en hund');
            expect(q.answersLabel).toBe('dog; hound');
        });
    });

    // TODO: merge

});
