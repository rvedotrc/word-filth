import React from "react";

import BaseItem from '../base';
import VocabRow from './vocab_row';

class Udtryk extends BaseItem{
    // Load from vocab list
    constructor(dbKey, data) {
        super();
        this.dbKey = dbKey;
        this.data = data;

        this.dansk = data.dansk;
        this.engelsk = data.engelsk;

        this.sortKey = data.dansk;
    }

    // create/edit form

    vocabRowClass() {
        return VocabRow;
    }

    // practice (multiple modes?)
}

export default Udtryk;
