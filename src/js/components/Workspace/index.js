import React, { Component } from "react";
import PropTypes from "prop-types";

import ShowResults from "../ShowResults";
import ShowVerbList from '../ShowVerbList';
import ShowYourData from '../ShowYourData';
import VerbTest from '../VerbTest';
import Welcome from "../Welcome";
import WorkspaceBar from "../WorkspaceBar";

class Workspace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'startTab'
        };
    }

    componentDidMount() {
        fetch('./verb-list.json')
            .then(response => response.json())
            .then((data) => {
                this.setState({ verbList: data.verber })
            });
    }

    switchTabTo(newTab) {
        this.setState({ selectedTab: newTab });
    }

    render() {
        const { user } = this.props;
        const { selectedTab, verbList } = this.state;

        return (
            <div>
                <WorkspaceBar onSwitchTab={(to) => {this.switchTabTo(to)}}/>

                {(selectedTab === 'startTab') && (
                    <Welcome/>
                )}
                {(selectedTab === 'verbListTab') && verbList && (
                    <ShowVerbList verbList={verbList}/>
                )}
                {(selectedTab === 'verbTestTab') && verbList && (
                    <VerbTest user={user} verbList={verbList}/>
                )}
                {(selectedTab === 'resultsTab') && (
                    <ShowResults user={user}/>
                )}
                {(selectedTab === 'yourDataTab') && (
                    <ShowYourData user={user}/>
                )}
            </div>
        )
    }
}

Workspace.propTypes = {
    user: PropTypes.object.isRequired
};

export default Workspace;
