class SpacedRepetition {
    constructor(user, key) {
        this.key = key;
        this.dbPath = `users/${user.uid}/results/${key}`;
        this.ref = firebase.database().ref(this.dbPath);
    }

    recordAnswer(isCorrect) {
        return this.ref.once('value').then(snapshot => {
            const now = new Date().getTime();

            const value = snapshot.val() || {};
            value.history = value.history || [];
            value.level = value.level || 0;

            if (now < value.nextTimestamp) {
                console.log("SpacedRepetition for", this.dbPath, "ignored because too soon");
                return;
            }

            value.history.push({
                timestamp: now,
                isCorrect: !!isCorrect
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
                console.log(`SpacedRepetition for ${this.dbPath} set to`, value);
            });
        });
    }

    gimme() {
        return this.ref.once('value').then(snapshot => {
            // Assuming we just recently did .recordAnswer(false),
            // try to rewrite is if it was actually .recordAnswer(true)
            if (this.oldGimmeLevel === undefined) {
                console.log(`Gimme for ${this.dbPath} ignored because oldGimmeLevel is missing`)
            }

            const now = new Date().getTime();

            const value = snapshot.val() || {};
            value.history = value.history || [];
            value.level = this.oldGimmeLevel;
            delete this.oldGimmeLevel;

            value.nextTimestamp = now + 2**value.level * 86400 * 1000;
            if (value.level < 9) value.level = value.level + 1;

            return this.ref.set(value).then(() => {
                console.log(`SpacedRepetition for ${this.dbPath} gimme'd to`, value);
            });
        });
    }
}

export default SpacedRepetition;
