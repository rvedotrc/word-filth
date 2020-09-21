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

        test('only one form', () => {
            const actual = new Bøjning().expandSubstantiv('hund', '-en');
            expect(actual).toEqual({
                ubestemtEntal: 'hund',
                bestemtEntal: 'hunden',
                ubestemtFlertal: '',
                bestemtFlertal: '',
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
            });
        });

        test("doesn't need 'at'", () => {
            const actual = new Bøjning().expandVerbum('spise', '-r, ..ste, spist');
            expect(actual).toEqual({
                nutid: 'spiser',
                datid: 'spiste',
                førnutid: 'spist',
            });
        });

        test("doesn't need spaces", () => {
            const actual = new Bøjning().expandVerbum('spise', '-r,..ste,spist');
            expect(actual).toEqual({
                nutid: 'spiser',
                datid: 'spiste',
                førnutid: 'spist',
            });
        });

        test('provides a shortcut for group 1', () => {
            const actual = new Bøjning().expandVerbum('dukke', '1');
            expect(actual).toEqual({
                nutid: 'dukker',
                datid: 'dukkede',
                førnutid: 'dukket',
            });
        });

        test('provides a shortcut for group 2', () => {
            const actual = new Bøjning().expandVerbum('at spise', '2');
            expect(actual).toEqual({
                nutid: 'spiser',
                datid: 'spiste',
                førnutid: 'spist',
            });
        });

        test('dedupes consonants for group 2', () => {
            const actual = new Bøjning().expandVerbum('at glemme', '2');
            expect(actual).toEqual({
                nutid: 'glemmer',
                datid: 'glemte',
                førnutid: 'glemt',
            });
        });

        test('does not dedupe consonants for group 1', () => {
            const actual = new Bøjning().expandVerbum('at svømme', '1');
            expect(actual).toEqual({
                nutid: 'svømmer',
                datid: 'svømmede',
                førnutid: 'svømmet',
            });
        });

        test('does not dedupe consonants for manual spec', () => {
            const actual = new Bøjning().expandVerbum('at hedde', '-r,hed,-t');
            expect(actual).toEqual({
                nutid: 'hedder',
                datid: 'hed',
                førnutid: 'heddet',
            });
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
