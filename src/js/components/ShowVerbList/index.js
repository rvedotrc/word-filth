import React, { Component } from "react";
import PropTypes from "prop-types";

import ShowVerbListRow from "../ShowVerbListRow";

class ShowVerbList extends Component {
    render() {
        const { verbList } = this.props;

        return (
            <div id="VerbList" className={'message'}>
                <h2>List af Verber</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Infinitiv</th>
                            <th>Imperativ</th>
                            <th>Nutid</th>
                            <th>Datid</th>
                            <th>Førnutid</th>
                            <th>Læs mere</th>
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
