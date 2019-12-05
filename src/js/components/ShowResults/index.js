import React, { Component } from "react";
import PropTypes from "prop-types";

import ShowResultsRow from "./row";
import Questions from "../../Questioner";

class ShowResults extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/results`);
        ref.on('value', snapshot => this.setState({ results: snapshot.val() }));
        this.setState({ ref: ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    getQuestionsAndResults(results) {
        const questions = Questions.getQuestions();

        const unrecognisedResultKeys = {}
        Object.keys(results).map(k => unrecognisedResultKeys[k] = true);

        const answer = questions.map(question => {
            delete unrecognisedResultKeys[question.resultsKey];
            return {
                question,
                result: results[question.resultsKey] || {
                    level: 0,
                    history: [],
                    nextTimestamp: null
                }
            };
        });

        // Warn on consistency error
        if (Object.keys(unrecognisedResultKeys).length > 0) {
            console.log("Unrecognised results keys:", Object.keys(unrecognisedResultKeys).sort());
        }

        return answer;
    }

    render() {
        if (!this.state) return null;
        const { results } = this.state;
        if (!results) return null;

        const questionsAndResults = this.getQuestionsAndResults(results)
            .sort((a, b) => (
                (a.question.resultsLabel < b.question.resultsLabel)
                ? -1
                : (a.question.resultsLabel > b.question.resultsLabel)
                ? +1
                : 0
            ));

        const atLevel = {};
        questionsAndResults.map(qr => {
            const level = qr.result.level;
            atLevel[level] = (atLevel[level] || 0) + 1;
        });

        return (
            <div id="VerbList" className={'message'}>
                <h2>Dine Resultater</h2>
                <p>Antal, på hvert niveau: {
                    [0,1,2,3,4,5,6,7,8,9].map(level => `${level}:${atLevel[level] || 0}`).join(' / ')
                }</p>
                <table>
                    <thead>
                        <tr>
                            <th>Nøgle</th>
                            <th>Niveau</th>
                            <th>Prøv igen efter</th>
                            {/*<th>Historie</th>*/}
                        </tr>
                    </thead>
                    <tbody>
                        {questionsAndResults.map(qr => (
                            <ShowResultsRow
                                resultKey={qr.question.resultsLabel}
                                resultValue={qr.result}
                                key={qr.question.resultsKey}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

ShowResults.propTypes = {
    user: PropTypes.object.isRequired
}

export default ShowResults;
