import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import MyVocabPage from '../MyVocab/page';
import Settings from '../Settings';
import ShowResults from '../ShowResults';
import ShowYourData from '../ShowYourData';
import Tester from '../Tester';
import Welcome from '../Welcome';
import WorkspaceBar from '../WorkspaceBar';

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
} & WithTranslation

type State = {
    selectedTab: string;
    vocabSubset?: Set<string>;
}

class Workspace extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedTab: 'startTab',
        };
    }

    private switchTabTo(newTab: string) {
        this.setState({ selectedTab: newTab, vocabSubset: undefined });
    }

    private onTestSubset(vocabSubset: Set<string>) {
        this.setState({ selectedTab: 'testTab', vocabSubset });
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
                        <Tester
                            user={user}
                            vocabSubset={this.state.vocabSubset}
                            // So that clicking the toolbar while using a filtered set,
                            // fully removes the filter.
                            key={`tester-${!!this.state.vocabSubset}`}
                        />
                    )}
                    {(selectedTab === 'myVocabTab') && (
                        <MyVocabPage
                            user={user}
                            onTestSubset={vocabSubset => this.onTestSubset(vocabSubset)}
                        />
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

export default withTranslation()(Workspace);
