import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AddNoun extends Component {
    constructor(props) {
        super(props);

        this.state = {
            køn: '',
            ubestemtEntal: '',
            bøjning: '',
            ubestemtFlertal: '',
            bestemtEntal: '',
            bestemtFlertal: '',
            engelsk: ''
        };
    }

    handleKøn(e) {
        const value = e.target.value.toLowerCase();

        if (value.trim().match(/^(en|n|f|fælleskøn)$/)) {
            this.setState({ køn: 'en' });
        }
        else if (value.trim().match(/^(et|t|i|intetkøn)$/)) {
            this.setState({ køn: 'et' });
        }
        else if (value.trim().match(/^(p|pluralis)$/)) {
            this.setState({ køn: 'pluralis' });
        }
        else if (value === 'e') {
            this.setState({ køn: 'e' });
        } else {
            this.setState({ køn: '' });
        }
    }

    handleChange(e, field) {
        const newState = {};
        newState[field] = e.target.value.toLowerCase().trim();
        this.setState(newState);
    }

    handleBøjning(e) {
        const { ubestemtEntal } = this.state;
        const bøjning = e.target.value.toLowerCase();
        this.setState({ bøjning });

        const match = bøjning.match(/^\s*(\S+),\s*(\S+),\s*(\S+)\s*$/);
        if (match) {
            this.setState({
                bestemtEntal: this.bøj(ubestemtEntal, match[1]),
                ubestemtFlertal: this.bøj(ubestemtEntal, match[2]),
                bestemtFlertal: this.bøj(ubestemtEntal, match[3]),
                bøjning
            });
        }
    }

    bøj(base, spec) {
        if (spec.startsWith('-')) {
            return base + spec.substr(1);
        } else if (spec.startsWith('..')) {
            return 'TODO';
        } else {
            return spec;
        }
    }

    onSubmit() {
        const { køn, ubestemtEntal, bestemtEntal, ubestemtFlertal, bestemtFlertal, engelsk } = this.state;

        const harKøn = (køn === 'en' || køn === 'et' || køn === 'pluralis');

        const harDansk = (
            ubestemtEntal !== '' ||
            bestemtEntal !== '' ||
            ubestemtFlertal !== '' ||
            bestemtFlertal !== ''
        );

        if (harKøn && harDansk && engelsk !== '') {
            var newRef = this.props.dbref.push();
            newRef.set({
                type: 'substantiv',
                køn,
                ubestemtEntal,
                bestemtEntal,
                ubestemtFlertal,
                bestemtFlertal,
                engelsk
            }).then(() => {
                this.setState({
                    køn: '',
                    ubestemtEntal: '',
                    bestemtEntal: '',
                    ubestemtFlertal: '',
                    bestemtFlertal: '',
                    bøjning: '',
                    engelsk: ''
                });
            });
        }
    }

    render() {
        const { køn, ubestemtEntal, bøjning, bestemtEntal, ubestemtFlertal, bestemtFlertal, engelsk } = this.state;

        return (
            <form onSubmit={(e) => { e.preventDefault(); this.onSubmit(); }}>
                <table>
                    <tbody>
                        <tr>
                            <td>Køn:</td>
                            <td>
                                <input
                                    type="text"
                                    name="køn"
                                    size="10"
                                    value={køn}
                                    onChange={(e) => this.handleKøn(e)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (ubestemt ental form):</td>
                            <td>
                                <input
                                    type="text"
                                    name="ubestemtEntal"
                                    size="30"
                                    value={ubestemtEntal}
                                    onChange={(e) => this.handleChange(e, 'ubestemtEntal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Bøjning:</td>
                            <td>
                                <input
                                    type="text"
                                    name="bøjning"
                                    size="30"
                                    value={bøjning}
                                    onChange={(e) => this.handleBøjning(e)}
                                />
                                <i> fx '-en, -er, -erne'</i>
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (bestemt ental form):</td>
                            <td>
                                <input
                                    type="text"
                                    name="bestemtEntal"
                                    size="30"
                                    value={bestemtEntal}
                                    onChange={(e) => this.handleChange(e, 'bestemtEntal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (ubestemt flertal form):</td>
                            <td>
                                <input
                                    type="text"
                                    name="ubestemtFlertal"
                                    size="30"
                                    value={ubestemtFlertal}
                                    onChange={(e) => this.handleChange(e, 'ubestemtFlertal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Dansk (bestemt flertal form):</td>
                            <td>
                                <input
                                    type="text"
                                    name="bestemtFlertal"
                                    size="30"
                                    value={bestemtFlertal}
                                    onChange={(e) => this.handleChange(e, 'bestemtFlertal')}
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

AddNoun.propTypes = {
    dbref: PropTypes.object.isRequired
};

export default AddNoun;
