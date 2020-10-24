import {Result} from "../Questions/types";

declare const firebase: typeof import('firebase');
import DataSnapshot = firebase.database.DataSnapshot;

class SpacedRepetition {

    private readonly resultsKey: string;
    private readonly dbPath: string;
    private readonly ref: firebase.database.Reference;
    private originalResult?: Result;
    private lastIsCorrect?: boolean;

    constructor(user: firebase.User, resultsKey: string) {
        this.resultsKey = resultsKey;
        // FIXME: encapsulation, see also listener in Wiring
        this.dbPath = `users/${user.uid}/results/${resultsKey}`;
        this.ref = firebase.database().ref(this.dbPath);
    }

    public async recordAnswer(isCorrect: boolean, timeNow?: number): Promise<void> {
        if (!timeNow) timeNow = new Date().getTime();

        const oldResult = await this.load();

        if (oldResult.nextTimestamp && timeNow < oldResult.nextTimestamp) return;
        if (isCorrect === this.lastIsCorrect) return;

        const newResult = {
            ...oldResult,
            history: [...oldResult.history, { timestamp: timeNow, isCorrect }],
        };

        if (isCorrect) {
            newResult.nextTimestamp = timeNow + 2**newResult.level * 86400 * 1000;
            if (newResult.level < 9) ++newResult.level;
        } else {
            if (newResult.level > 0) --newResult.level;
            newResult.nextTimestamp = timeNow + 2**newResult.level * 86400 * 1000;
        }

        await this.ref.set(newResult);

        this.lastIsCorrect = isCorrect;
        console.debug(`SpacedRepetition for ${this.dbPath}`
            + ` changed from ${SpacedRepetition.resultToString(oldResult)}`
            + ` to ${SpacedRepetition.resultToString(newResult)}`);
    }

    public isCorrect(): boolean | undefined {
        return this.lastIsCorrect;
    }

    private async load(): Promise<Result> {
        if (this.originalResult) return this.originalResult;

        const snapshot: DataSnapshot = await this.ref.once('value');

        const value: Result = snapshot.val() || {};
        value.history = value.history || [];
        value.level = value.level || 0;

        this.originalResult = value;
        this.lastIsCorrect = undefined;

        return value;
    }

    private static resultToString(result: Result): string {
        return `L:${result.level} N:${result.nextTimestamp ? new Date(result.nextTimestamp) : '-'}`;
    }

}

export default SpacedRepetition;
