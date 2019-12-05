import React, { Component } from "react";
import PropTypes from "prop-types";

class Base extends Component {
    render() {
        const { item, isDeleting, isSelected, onToggleSelected } = this.props;

        return (
            <tr>
                <td>{item.data.type}</td>
                {isDeleting && (
                    <td>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleSelected(item.dbKey)}
                        />
                    </td>
                )}
                <td>{this.state.danskText}</td>
                <td>{this.state.engelskText}</td>
            </tr>
        );
    }
}

Base.propTypes = {
    item: PropTypes.object.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onToggleSelected: PropTypes.func.isRequired
};

export default Base;
