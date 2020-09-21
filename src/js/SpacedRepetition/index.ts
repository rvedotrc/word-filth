import {Result} from "../Questions/types";

declare const firebase: typeof import('firebase');
import DataSnapshot = firebase.database.DataSnapshot;

class SpacedRepetition {

    private readonly key: string;
    private readonly dbPath: string;
    private readonly ref: firebase.database.Reference;
    private oldGimmeLevel: number | undefined;

    constructor(user: firebase.User, key: string) {
        this.key = key;
        // FIXME: encapsulation, see also listener in Wiring
        this.dbPath = `users/${user.uid}/results/${key}`;
        this.ref = firebase.database().ref(this.dbPath);
    }

    recordAnswer(isCorrect: boolean) {
        return this.ref.once('value').then((snapshot: DataSnapshot) => {
            const now = new Date().getTime();

            const value: Result = snapshot.val() || {};
            value.history = value.history || [];
            value.level = value.level || 0;

            if (value.nextTimestamp && now < value.nextTimestamp) {
                console.warn("SpacedRepetition for", this.dbPath, "ignored because too soon");
                return;
            }

            value.history.push({
                timestamp: now,
                isCorrect,
            });

            if (isCorrect) {
                value.nextTimestamp = now + 2**value.level * 86400 * 1000;
                if (value.level < 9) value.level = value.level + 1;
            } else {
                this.oldGimmeLevel = value.level;
                if (value.level > 0) value.level = value.level - 1;
                value.nextTimestamp = now + 2**value.level * 86400 * 1000;
            }

            return this.ref.set(value).then(() => {
                console.debug(`SpacedRepetition for ${this.dbPath} set to`, value);
            });
        });
    }

    gimme() {
        return this.ref.once('value').then((snapshot: DataSnapshot) => {
            // Assuming we just recently did .recordAnswer(false),
            // try to rewrite is if it was actually .recordAnswer(true)
            if (this.oldGimmeLevel === undefined) {
                console.warn(`Gimme for ${this.dbPath} ignored because oldGimmeLevel is missing`);
                return;
            }

            const now = new Date().getTime();

            const value = snapshot.val() || {};
            value.history = value.history || [];
            value.level = this.oldGimmeLevel;
            delete this.oldGimmeLevel;

            value.nextTimestamp = now + 2**value.level * 86400 * 1000;
            if (value.level < 9) value.level = value.level + 1;

            return this.ref.set(value).then(() => {
                console.debug(`SpacedRepetition for ${this.dbPath} gimme'd to`, value);
            });
        });
    }
}

export default SpacedRepetition;
