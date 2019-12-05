import React, { Component } from "react";
import PropTypes from "prop-types";

import BaseRow from '../base/vocab_row';

class VocabRow extends BaseRow {
    constructor(props) {
        super(props);

        const item = props.item;

        this.state = {
            danskText: item.dansk,
            engelskText: item.engelsk,
            detaljer: ''
        };
    }
}

// VocabRow.propTypes = {
//     item: PropTypes.object.isRequired
// };

export default VocabRow;
