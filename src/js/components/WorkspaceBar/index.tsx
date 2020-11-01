import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {SelectedTab} from "@components/Workspace";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./index.css");

type Props = {
    onSwitchTab: (value: SelectedTab) => void;
} & WithTranslation

const WorkspaceBar = (props: Props) => {
    const { t, onSwitchTab } = props;

    return (
        <div className={styles.WorkspaceBar}>
            <button onClick={()=>{onSwitchTab('startTab')}}>{t('workspace_bar.home')}</button>
            <button onClick={()=>{onSwitchTab('testTab')}}>{t('workspace_bar.practice')}</button>
            <button onClick={()=>{onSwitchTab('myVocabTab')}}>{t('workspace_bar.your_vocab')}</button>
            <button onClick={()=>{onSwitchTab('resultsTab')}}>{t('workspace_bar.your_results')}</button>
            <button onClick={()=>{onSwitchTab('yourDataTab')}}>{t('workspace_bar.your_data')}</button>
            <button onClick={()=>{onSwitchTab('settingsTab')}}>{t('workspace_bar.settings')}</button>
        </div>
    );
};

export default withTranslation()(WorkspaceBar);
