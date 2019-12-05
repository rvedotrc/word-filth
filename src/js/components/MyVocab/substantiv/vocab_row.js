import React, { Component } from "react";
import PropTypes from "prop-types";

import BaseRow from '../base/vocab_row';

class VocabRow extends BaseRow {
    constructor(props) {
        super(props);

        const item = props.item;

        this.state = {
            danskText: (item.ubestemtEntal || item.ubestemtFlertal),
            engelskText: props.item.engelsk
        };
    }
}

// VocabRow.propTypes = {
//     item: PropTypes.object.isRequired
// };

export default VocabRow;
