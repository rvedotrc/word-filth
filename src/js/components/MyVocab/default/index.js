import React from "react";
import VocabRow from './vocab_row';

class Default {
    // Load from vocab list
    constructor(dbKey, data) {
        this.dbKey = dbKey;
        this.data = data;

        this.sortKey = JSON.stringify(data);
    }

    // create/edit form

    asVocabEntry(key) {
        return React.createElement(VocabRow, { item: this, key: this.dbKey }, null);
    }

    // practice (multiple modes?)
}

export default Default;
