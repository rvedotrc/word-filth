import React from "react";

import BaseItem from "../base";
import VocabRow from './vocab_row';

class Default extends BaseItem {
    // Load from vocab list
    constructor(dbKey, data) {
        super();
        this.dbKey = dbKey;
        this.data = data;

        this.sortKey = JSON.stringify(data);
    }

    vocabRowClass() {
        return VocabRow;
    }

    // create/edit form


    // practice (multiple modes?)
}

export default Default;
