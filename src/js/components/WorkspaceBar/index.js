import React, { Component } from "react";
import PropTypes from "prop-types";

class WorkspaceBar extends Component {
    switchTabTo(newTab) {
        this.props.onSwitchTab(newTab);
    }

    render() {
        return (
            <div id={'WorkspaceBar'}>
                <button onClick={()=>{this.switchTabTo('startTab')}}>Hjem</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('verbListTab')}}>Vis List af Verber</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('verbTestTab')}}>Øv Dine Verber</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('resultsTab')}}>Vis Dine Resultater</button>
                &nbsp;
                <button onClick={()=>{this.switchTabTo('yourDataTab')}}>Vis Din Data</button>
            </div>
        )
    }
}

WorkspaceBar.propTypes = {
    onSwitchTab: PropTypes.func.isRequired
}

export default WorkspaceBar;
