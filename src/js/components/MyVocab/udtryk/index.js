import React from "react";
import VocabRow from './vocab_row';

class Udtryk {
    // Load from vocab list
    constructor(dbKey, data) {
        this.dbKey = dbKey;
        this.data = data;

        this.dansk = data.dansk;
        this.engelsk = data.engelsk;

        this.sortKey = data.dansk;
    }

    // create/edit form

    asVocabEntry() {
        return React.createElement(VocabRow, { item: this, key: this.dbKey }, null);
    }

    // practice (multiple modes?)
}

export default Udtryk;
