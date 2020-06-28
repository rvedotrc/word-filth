import GivenInfinitiveQuestion from './index';

describe(GivenInfinitiveQuestion, () => {

    const verb_se = {
        lang: 'da',
        infinitiv: 'at se',
        nutid: ['ser'],
        datid: ['så'],
        førnutid: ['set'],
        engelsk: 'to see',
    };

    describe('constructor', () => {
        test('simple', () => {
            const q = new GivenInfinitiveQuestion(verb_se.infinitiv, [verb_se], []);
            expect(q.resultsKey).toBe('verb-infinitiv-se');
            expect(q.resultsLabel).toBe('at se');
            expect(q.engelsk).toBe('to see');
        });

        test('multiple engelsk', () => {
            const verb1 = {...verb_se, engelsk: 'to foo'};
            const verb2 = {...verb_se, engelsk: 'to bar'};

            const q = new GivenInfinitiveQuestion(verb_se.infinitiv, [verb1, verb2], []);
            expect(q.resultsKey).toBe('verb-infinitiv-se');
            expect(q.resultsLabel).toBe('at se');
            expect(q.engelsk).toBe('to bar; to foo');
        });

        test('engelsk is deduped', () => {
            const verb1 = {...verb_se, engelsk: 'to foo'};
            const verb2 = {...verb_se, engelsk: 'to bar'};
            const verb3 = {...verb_se, engelsk: 'to bar'};

            const q = new GivenInfinitiveQuestion(verb_se.infinitiv, [verb1, verb2, verb3], []);
            expect(q.resultsKey).toBe('verb-infinitiv-se');
            expect(q.resultsLabel).toBe('at se');
            expect(q.engelsk).toBe('to bar; to foo');
        });
    });

});
