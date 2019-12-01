import React, { Component } from "react";
import PropTypes from "prop-types";

class AddPhrase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dansk: '',
            engelsk: ''
        };
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value;
        this.setState(newState);
    }

    onSubmit() {
        const dansk = this.state.dansk.trim();
        const engelsk = this.state.engelsk.trim();

        if (dansk !== '' && engelsk !== '') {
            var newRef = this.props.dbref.push();
            newRef.set({
                type: 'udtryk',
                dansk: dansk,
                engelsk: engelsk
            }).then(() => {
                this.setState({
                    dansk: '',
                    engelsk: ''
                });
            });
        }
    }

    render() {
        const { dansk, engelsk } = this.state;

        return (
            <form onSubmit={(e) => { e.preventDefault(); this.onSubmit(); }}>
                <table>
                    <tbody>
                        <tr>
                            <td>Dansk:</td>
                            <td>
                                <input
                                    type="text"
                                    name="dansk"
                                    size="30"
                                    value={dansk}
                                    onChange={(e) => this.handleChange(e, 'dansk')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Engelsk:</td>
                            <td>
                                <input
                                    type="text"
                                    name="engelsk"
                                    size="30"
                                    value={engelsk}
                                    onChange={(e) => this.handleChange(e, 'engelsk')}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <input type="submit" value="Tilføj"/>
            </form>
        )
    }
}

AddPhrase.propTypes = {
    dbref: PropTypes.object.isRequired
};

export default AddPhrase;
