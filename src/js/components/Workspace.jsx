import React, { Component } from "react";
import PropTypes from "prop-types";

import VerbList from './VerbList.jsx';

class Workspace extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch('./verb-list.json')
            .then(response => response.json())
            .then((data) => {
                this.setState({ verb_list: data.verber })
            });
    }

    render() {
        const { user } = this.props;
        const { verb_list } = this.state;

        return (
            <div>
                <h2>Workspace</h2>
                {verb_list && <VerbList verb_list={verb_list}/>}
            </div>
        )
    }
}

Workspace.propTypes = {
    user: PropTypes.object.isRequired
};

export default Workspace;
