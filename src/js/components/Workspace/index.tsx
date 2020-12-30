import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import MyVocabPage from '../MyVocab/page';
import Settings from '../Settings';
import ShowResults from '../ShowResults';
import ShowYourData from '../ShowYourData';
import Tester from '../Tester';
import Welcome from '../Welcome';
import WorkspaceBar from '../WorkspaceBar';
import {useState} from "react";

declare const firebase: typeof import('firebase');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./index.css');

type Props = {
    user?: firebase.User;
    hidden: boolean;
} & WithTranslation

export type SelectedTab =
    'startTab'
    | 'testTab'
    | 'myVocabTab'
    | 'resultsTab'
    | 'yourDataTab'
    | 'settingsTab';

const Workspace = (props: Props) => {
    const [selectedTab, setSelectedTab] = useState<SelectedTab>('startTab');
    const [vocabSubset, setVocabSubset] = useState<Set<string>>();

    const switchTabTo = (newTab: SelectedTab) => {
        setSelectedTab(newTab);
        setVocabSubset(undefined);
    };

    const onTestSubset = (newVocabSubset: Set<string>) => {
        setSelectedTab('testTab');
        setVocabSubset(newVocabSubset);
    };

    const { user } = props;

    if (!user) {
        return (
            <div className={styles.workspace}>
                <Welcome/>
            </div>
        );
    }

    return (
        <div style={{display: props.hidden ? "none" : "block"}}>
            <WorkspaceBar onSwitchTab={(to: SelectedTab) => {switchTabTo(to)}}/>

            <div className={styles.workspace}>
                {(selectedTab === 'startTab') && (
                    <Welcome/>
                )}
                {(selectedTab === 'testTab') && (
                    <Tester
                        user={user}
                        vocabSubset={vocabSubset}
                        // So that clicking the toolbar while using a filtered set,
                        // fully removes the filter.
                        key={`tester-${vocabSubset !== undefined}`}
                    />
                )}
                {(selectedTab === 'myVocabTab') && (
                    <MyVocabPage user={user} onTestSubset={onTestSubset}/>
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
    );
};

export default withTranslation()(Workspace);
