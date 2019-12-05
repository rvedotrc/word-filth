import React from "react";

class BaseItem {
    asVocabEntry(rowProps) {
        const props = new Object(rowProps);
        props.item = this;
        props.key = this.dbKey;
        return React.createElement(this.vocabRowClass(), props, null);
    }

    // must provide vocabRowClass
}

export default BaseItem;
