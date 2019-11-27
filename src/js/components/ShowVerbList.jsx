import React, { Component } from "react";
import PropTypes from "prop-types";

import ShowVerbListRow from "./ShowVerbListRow.jsx";

class ShowVerbList extends Component {
    render() {
        const { verbList } = this.props;

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
                        {verbList.map((verb, index) => (
                            <ShowVerbListRow verb={verb} key={verb.tekst}/>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

ShowVerbList.propTypes = {
    verbList: PropTypes.array.isRequired
}

export default ShowVerbList;
