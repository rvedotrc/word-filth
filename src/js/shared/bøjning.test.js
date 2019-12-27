import Bøjning from './bøjning';

describe('bøjning', () => {

    describe('expandSubstantiv', () => {

        test('fully specified', () => {
            const actual = new Bøjning().expandSubstantiv('one', 'two,three,four');
            expect(actual).toEqual({
                ubestemtEntal: 'one',
                bestemtEntal: 'two',
                ubestemtFlertal: 'three',
                bestemtFlertal: 'four',
            });
        });

        test('allows spaces after commas', () => {
            const actual = new Bøjning().expandSubstantiv('one', 'two, three, four');
            expect(actual).toEqual({
                ubestemtEntal: 'one',
                bestemtEntal: 'two',
                ubestemtFlertal: 'three',
                bestemtFlertal: 'four',
            });
        });

        test('supports -suffix', () => {
            const actual = new Bøjning().expandSubstantiv('one', '-s,-sie,-');
            expect(actual).toEqual({
                ubestemtEntal: 'one',
                bestemtEntal: 'ones',
                ubestemtFlertal: 'onesie',
                bestemtFlertal: 'one',
            });
        });

        test('supports ..overlap', () => {
            const actual = new Bøjning().expandSubstantiv('fiction', '-,-,..ive');
            expect(actual).toEqual({
                ubestemtEntal: 'fiction',
                bestemtEntal: 'fiction',
                ubestemtFlertal: 'fiction',
                bestemtFlertal: 'fictive',
            });
        });

        test('returns null for others', () => {
            const actual = new Bøjning().expandSubstantiv('foo', '-,-');
            expect(actual).toEqual(null);
        });

    });

    describe('expandVerbum', () => {

        test('expands', () => {
            const actual = new Bøjning().expandVerbum('at spise', '-r, ..ste, spist');
            expect(actual).toEqual({
                nutid: 'spiser',
                datid: 'spiste',
                førnutid: 'spist',
            })
        });

        test("doesn't need 'at'", () => {
            const actual = new Bøjning().expandVerbum('spise', '-r, ..ste, spist');
            expect(actual).toEqual({
                nutid: 'spiser',
                datid: 'spiste',
                førnutid: 'spist',
            })
        });

        test("doesn't need spaces", () => {
            const actual = new Bøjning().expandVerbum('spise', '-r,..ste,spist');
            expect(actual).toEqual({
                nutid: 'spiser',
                datid: 'spiste',
                førnutid: 'spist',
            })
        });

        test('returns null for others', () => {
            const actual = new Bøjning().expandVerbum('foo', '-,-');
            expect(actual).toEqual(null);
        });

    });

    describe('expandAdjektiv', () => {

        test('expands', () => {
            const actual = new Bøjning().expandAdjektiv('rød', '-t, -e');
            expect(actual).toEqual({
                grundForm: 'rød',
                tForm: 'rødt',
                langForm: 'røde',
                komparativ: '',
                superlativ: '',
            });
        });

        test("doesn't need spaces", () => {
            const actual = new Bøjning().expandAdjektiv('rød', '..dt,røde');
            expect(actual).toEqual({
                grundForm: 'rød',
                tForm: 'rødt',
                langForm: 'røde',
                komparativ: '',
                superlativ: '',
            });
        });

        test("allows comparative and superlative", () => {
            const actual = new Bøjning().expandAdjektiv('gammel', '-t, ..amle ældre, ældste');
            expect(actual).toEqual({
                grundForm: 'gammel',
                tForm: 'gammelt',
                langForm: 'gamle',
                komparativ: 'ældre',
                superlativ: 'ældste',
            });
        });

        test('returns null for others', () => {
            const actual = new Bøjning().expandAdjektiv('foo', 'bar');
            expect(actual).toEqual(null);
        });

    });

});
