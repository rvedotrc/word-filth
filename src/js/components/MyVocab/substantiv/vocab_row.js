import React, { Component } from "react";
import PropTypes from "prop-types";

import BaseRow from '../base/vocab_row';

class VocabRow extends BaseRow {
    constructor(props) {
        super(props);

        const item = props.item;

        const forms = [item.bestemtEntal, item.ubestemtFlertal, item.bestemtFlertal].filter(e => e);

        this.state = {
            danskText: (item.ubestemtEntal || item.ubestemtFlertal),
            engelskText: props.item.engelsk,
            detaljer: `${forms.join(', ')} (${item.køn})`
        };
    }
}

// VocabRow.propTypes = {
//     item: PropTypes.object.isRequired
// };

export default VocabRow;
