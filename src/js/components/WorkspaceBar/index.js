import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WorkspaceBar extends Component {
    switchTabTo(newTab) {
        this.props.onSwitchTab(newTab);
    }

    render() {
        return (
            <div id={'WorkspaceBar'}>
                <button onClick={()=>{this.switchTabTo('startTab')}}>Hjem</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('testTab')}}>Øv</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('verbListTab')}}>List af Verber</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('myVocabTab')}}>Dit Ordforråd</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('resultsTab')}}>Dine Resultater</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('yourDataTab')}}>Dit Data</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('settingsTab')}}>Indstillinger</button>
            </div>
        )
    }
}

WorkspaceBar.propTypes = {
    onSwitchTab: PropTypes.func.isRequired
};

export default WorkspaceBar;
