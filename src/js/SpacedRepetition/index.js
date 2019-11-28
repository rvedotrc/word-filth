class SpacedRepetition {
    constructor(user, key) {
        this.key = key;
        this.dbPath = `users/${user.uid}/results/${key}`;
        this.ref = firebase.database().ref(this.dbPath);
    }

    recordAnswer(isCorrect) {
        return this.ref.once('value').then((snapshot) => {
            console.log("snapshot", snapshot);
            console.log("old value", snapshot.val());
            const now = new Date().getTime();

            const value = snapshot.val() || {};
            value.history = value.history || [];
            value.level = value.level || 0;

            if (now < value.nextTimestamp) return value;

            value.history.push({
                timestamp: now,
                isCorrect: isCorrect ? true : false
            });

            const today = Math.floor(now / 86400 / 1000);

            if (isCorrect) {
                value.nextTimestamp = now + 2**value.level * 86400 * 1000;
                if (value.level < 9) value.level = value.level + 1;
            } else {
                if (value.level > 0) value.level = value.level - 1;
                value.nextTimestamp = now + 2**value.level * 86400 * 1000;
            }

            return this.ref.set(value).then(() => value);
        }).then(value => {
            console.log("SpacedRepetition for", this.dbPath, "set to", value);
        });
    }
}

export default SpacedRepetition;
