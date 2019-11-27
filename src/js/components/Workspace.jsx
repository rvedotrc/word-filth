import React, { Component } from "react";
import PropTypes from "prop-types";

import ShowVerbList from './ShowVerbList.jsx';
import VerbTest from './VerbTest.jsx';
import Welcome from "./Welcome.jsx";

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
                <h2>Workspace</h2>

                <p>
                    <button onClick={()=>{this.switchTabTo('startTab')}}>Start</button>
                    <button onClick={()=>{this.switchTabTo('verbListTab')}} disabled={!verbList}>Vis List af Verber</button>
                    <button onClick={()=>{this.switchTabTo('verbTestTab')}} disabled={!verbList}>Øv Dine Verber</button>
                </p>

                {(selectedTab === 'startTab') && (
                    <Welcome/>
                )}
                {(selectedTab === 'verbListTab') && verbList && (
                    <ShowVerbList verbList={verbList}/>
                )}
                {(selectedTab === 'verbTestTab') && verbList && (
                    <VerbTest user={user} verbList={verbList}/>
                )}
            </div>
        )
    }
}

Workspace.propTypes = {
    user: PropTypes.object.isRequired
};

export default Workspace;
