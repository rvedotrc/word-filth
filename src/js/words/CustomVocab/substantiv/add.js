import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Bøjning from "../../../shared/bøjning";
import TextTidier from '../../../shared/text_tidier';
import GenderInput from "../../../components/shared/gender_input";

class AddNoun extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.firstInputRef = React.createRef();
    }

    initialState() {
        const s = {
            køn: null,
            ubestemtEntal: '',
            bøjning: '',
            ubestemtFlertal: '',
            bestemtEntal: '',
            bestemtFlertal: '',
            engelsk: '',
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state) {
        const tidyLowerCase = (s) => TextTidier.normaliseWhitespace(s).toLowerCase();

        const item = {
            type: 'substantiv',
            køn: state.køn,
        };

        if (item.køn !== 'en' && item.køn !== 'et' && item.køn !== 'pluralis') return;

        let hasForm = false;
        ['ubestemtEntal', 'bestemtEntal', 'ubestemtFlertal', 'bestemtFlertal'].map(key => {
            const t = tidyLowerCase(state[key]);
            if (t !== '') {
                item[key] = t;
                hasForm = true;
            }
        });
        if (!hasForm) return;

        const t = TextTidier.normaliseWhitespace(state.engelsk);
        item.engelsk = t;
        if (item.engelsk === '') return;

        return item;
    }

    handleKøn(value) {
        const newState = new Object(this.state);
        newState.køn = value;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    handleChange(e, field) {
        const newState = this.state;
        newState[field] = e.target.value;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    handleBøjning(e) {
        // FIXME: are there cases where we're modifying this.state in place?
        const { ubestemtEntal } = this.state;
        const bøjning = e.target.value.toLowerCase();
        this.setState({ bøjning });

        const result = new Bøjning().expandSubstantiv(
            TextTidier.normaliseWhitespace(ubestemtEntal),
            TextTidier.normaliseWhitespace(bøjning),
        );
        if (result) this.setState(result);
    }

    onSubmit() {
        const { itemToSave } = this.state;
        if (!itemToSave) return;

        const newRef = this.props.dbref.push();
        newRef.set(itemToSave).then(() => {
            this.setState(this.initialState());
            this.firstInputRef.current.focus();
        });
    }

    render() {
        const { t } = this.props;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onSubmit(); }}
                onReset={this.props.onCancel}
            >
                <h2>{t('my_vocab.add_noun.heading')}</h2>

                <p>{t('my_vocab.add_noun.help_1')}</p>
                <p>{t('my_vocab.add_noun.help_2')}</p>

                <table>
                    <tbody>
                        <tr>
                            <td>{t('my_vocab.add_noun.gender.label')}</td>
                            <td>
                                <GenderInput
                                    onChange={v => this.handleKøn(v)}
                                    autoFocus="yes"
                                    data-test-id="køn"
                                    inputRef={this.firstInputRef}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.indefinite_singular.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.ubestemtEntal}
                                    onChange={(e) => this.handleChange(e, 'ubestemtEntal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.inflection.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bøjning}
                                    onChange={(e) => this.handleBøjning(e)}
                                />
                                {' '}
                                <i>{t('my_vocab.add_noun.inflection.example')}</i>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.definite_singular.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bestemtEntal}
                                    onChange={(e) => this.handleChange(e, 'bestemtEntal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.indefinite_plural.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.ubestemtFlertal}
                                    onChange={(e) => this.handleChange(e, 'ubestemtFlertal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_noun.definite_plural.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bestemtFlertal}
                                    onChange={(e) => this.handleChange(e, 'bestemtFlertal')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('question.shared.label.english')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.engelsk}
                                    onChange={(e) => this.handleChange(e, 'engelsk')}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    <input type="submit" value={t('my_vocab.shared.add.button')} disabled={!this.state.itemToSave}/>
                    <input type="reset" value={t('my_vocab.shared.cancel.button')}/>
                </p>
            </form>
        )
    }
}

AddNoun.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default withTranslation()(AddNoun);
