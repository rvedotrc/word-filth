import React, { Component } from "react";
import PropTypes from "prop-types";

class VerbList extends Component {
    render() {
        const { verb_list } = this.props;

        return (
            <div>
                <h2>Verb List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Infinitiv</th>
                            <th>Imperativ</th>
                            <th>Nutid</th>
                            <th>Datid</th>
                            <th>Førnutid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {verb_list.map((verb, index) => {
                            return (
                                <tr>
                                    <td>{verb.infinitiv}</td>
                                    <td>{verb.imperativ}</td>
                                    <td>{verb.nutid.join(' / ')}</td>
                                    <td>{verb.datid.join(' / ')}</td>
                                    <td>{verb.førnutid.join(' / ')}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

VerbList.propTypes = {
    verb_list: PropTypes.object.required,
}

export default VerbList;
