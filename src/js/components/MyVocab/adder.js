import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UdtrykAdd from '../../words/CustomVocab/udtryk/add';
import SubstantivAdd from '../../words/CustomVocab/substantiv/add';

class Adder extends Component {
    render() {
        return (
            <div>
                <h2>Substantiv</h2>
                <SubstantivAdd dbref={this.props.dbref}/>
                <hr/>
                <h2>Udtryk</h2>
                <UdtrykAdd dbref={this.props.dbref}/>
            </div>
        );
    }
}

Adder.propTypes = {
    dbref: PropTypes.object.isRequired
};

export default Adder;
