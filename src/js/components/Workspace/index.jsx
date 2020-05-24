import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import MyVocabPage from '../MyVocab/page';
import Settings from '../Settings';
import ShowResults from '../ShowResults';
import ShowVerbList from '../ShowVerbList';
import ShowYourData from '../ShowYourData';
import Tester from '../Tester';
import Welcome from '../Welcome';
import WorkspaceBar from '../WorkspaceBar';

class Workspace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'startTab',
        };
    }

    switchTabTo(newTab) {
        this.setState({ selectedTab: newTab });
    }

    render() {
        const { user } = this.props;
        const { selectedTab } = this.state;

        return (
            <div>
                <WorkspaceBar onSwitchTab={(to) => {this.switchTabTo(to)}}/>

                <div className="container">
                    {(selectedTab === 'startTab') && (
                        <Welcome/>
                    )}
                    {(selectedTab === 'testTab') && (
                        <Tester user={user}/>
                    )}
                    {(selectedTab === 'verbListTab') && (
                        <ShowVerbList/>
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
                    {(selectedTab === 'settingsTab') && (
                        <Settings user={user}/>
                    )}
                </div>
            </div>
        )
    }
}

Workspace.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default withTranslation()(Workspace);