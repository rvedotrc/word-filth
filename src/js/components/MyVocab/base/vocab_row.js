import React, { Component } from "react";
import PropTypes from "prop-types";

class Base extends Component {
    render() {
        const { item } = this.props;

        return (
            <tr>
                <td>{item.data.type}</td>
                <td>{this.state.danskText}</td>
                <td>{this.state.engelskText}</td>
            </tr>
        );
    }
}

Base.propTypes = {
    item: PropTypes.object.isRequired
};

export default Base;
