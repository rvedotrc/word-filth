import React, { Component } from "react";
import PropTypes from "prop-types";

import MyVocabPage from "../MyVocab/page";
import ShowResults from "../ShowResults";
import ShowVerbList from '../ShowVerbList';
import ShowYourData from '../ShowYourData';
import Tester from '../../Questioner/tester';
import Welcome from "../Welcome";
import WorkspaceBar from "../WorkspaceBar";

import verbList from '../../Questioner/builtin_verb/verb-list.json';

class Workspace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'startTab',
            verbList: verbList.verber,
        };
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
                {(selectedTab === 'testTab') && verbList && (
                    <Tester user={user}/>
                )}
                {(selectedTab === 'myVocabTab') && (
                    <MyVocabPage user={user}/>
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
