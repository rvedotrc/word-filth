import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {SelectedTab} from "@components/Workspace";

type Props = {
    onSwitchTab: (value: SelectedTab) => void;
} & WithTranslation

const WorkspaceBar = (props: Props) => {
    const { t, onSwitchTab } = props;

    return (
        <div id={'WorkspaceBar'}>
            <button onClick={()=>{onSwitchTab('startTab')}}>{t('workspace_bar.home')}</button>
            &nbsp;
            <button onClick={()=>{onSwitchTab('testTab')}}>{t('workspace_bar.practice')}</button>
            &nbsp;
            <button onClick={()=>{onSwitchTab('myVocabTab')}}>{t('workspace_bar.your_vocab')}</button>
            &nbsp;
            <button onClick={()=>{onSwitchTab('resultsTab')}}>{t('workspace_bar.your_results')}</button>
            &nbsp;
            <button onClick={()=>{onSwitchTab('yourDataTab')}}>{t('workspace_bar.your_data')}</button>
            &nbsp;
            <button onClick={()=>{onSwitchTab('settingsTab')}}>{t('workspace_bar.settings')}</button>
        </div>
    );
};

export default withTranslation()(WorkspaceBar);
