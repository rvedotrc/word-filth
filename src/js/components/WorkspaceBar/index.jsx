import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class WorkspaceBar extends Component {
    switchTabTo(newTab) {
        this.props.onSwitchTab(newTab);
    }

    render() {
        const { t } = this.props;

        return (
            <div id={'WorkspaceBar'}>
                <button onClick={()=>{this.switchTabTo('startTab')}}>{t('workspace_bar.home')}</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('testTab')}}>{t('workspace_bar.practice')}</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('verbListTab')}}>{t('workspace_bar.list_of_verbs')}</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('myVocabTab')}}>{t('workspace_bar.your_vocab')}</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('resultsTab')}}>{t('workspace_bar.your_results')}</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('yourDataTab')}}>{t('workspace_bar.your_data')}</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('settingsTab')}}>{t('workspace_bar.settings')}</button>
            </div>
        )
    }
}

WorkspaceBar.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    onSwitchTab: PropTypes.func.isRequired
};

export default withTranslation()(WorkspaceBar);