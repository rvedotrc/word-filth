import { encode } from './results_key';

describe('encode', () => {

    const inputs = [
        "foo",
        "foo bar",
        "foo bar, e.g.",
        "foo # # it",
        "foo % % it",
        "foo %25 %27 it",
        "foo 1/2/3//4",
        "foo [yes] [no] $1$",
    ];

    for (let x of inputs) {
        const copy = x;
        test('safe encode: ' + copy, () => {
            const output = encode(copy);
            // Requirement of Firebase: disallowed characters in the path
            expect(output).not.toContain('.');
            expect(output).not.toContain('#');
            expect(output).not.toContain('$');
            expect(output).not.toContain('[');
            expect(output).not.toContain(']');
            // No path parts (between slashes) can be empty, we encode slashes too
            expect(output).not.toContain('/');
        });
    }

    test('the test inputs encode do different outputs', () => {
        const outputs = inputs.map(encode);
        expect([...new Set(outputs)]).toHaveLength(inputs.length);
    });

});
