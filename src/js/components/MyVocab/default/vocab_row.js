import React, { Component } from "react";
import PropTypes from "prop-types";

import BaseRow from '../base/vocab_row';

class VocabRow extends BaseRow {
    constructor(props) {
        super(props);
        this.state = {
            danskText: JSON.stringify(props.item),
            engelskText: '-'
        };
    }
}

VocabRow.propTypes = {
    item: PropTypes.object.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onToggleSelected: PropTypes.func.isRequired
};

export default VocabRow;
