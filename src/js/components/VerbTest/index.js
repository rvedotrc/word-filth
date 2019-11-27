import React, { Component } from "react";
import PropTypes from "prop-types";

class VerbTest extends Component {
    componentDidMount() {
        this.nextQuestion();
    }

    nextQuestion() {
        const { verbList } = this.props;
        const verb = verbList[Math.floor(Math.random() * verbList.length)];

        this.setState({
            verb: verb
        });
    }

    render() {
        const { verbList } = this.props;

        if (!this.state) return null;
        const { verb } = this.state;
        if (!verb) return null;

        return (
            <div id="VerbTest" className={'message'}>
                <h2>Øv dine verber</h2>
                <p>{verb.infinitiv}</p>
                <button onClick={() => this.nextQuestion()}>Næste</button>
            </div>
        )
    }
}

VerbTest.propTypes = {
    user: PropTypes.object.isRequired,
    verbList: PropTypes.array.isRequired
}

export default VerbTest;
