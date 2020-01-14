import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Bøjning from "../../../shared/bøjning";
import TextTidier from '../../../shared/text_tidier';

class AddAdjektiv extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.firstInputRef = React.createRef();
    }

    initialState() {
        const s = {
            grundForm: '',
            bøjning: '',
            tForm: '',
            langForm: '',
            komparativ: '',
            superlativ: '',
            engelsk: '',
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state) {
        if (!(
            state.grundForm !== ''
            && state.tForm !== ''
            && state.langForm !== ''
            && ((state.komparativ === '') === (state.superlativ === ''))
        )) return null;

        const tidyLowerCase = (s) => TextTidier.normaliseWhitespace(s).toLowerCase();

        const item = {
            type: 'adjektiv',
            grundForm: tidyLowerCase(state.grundForm),
            tForm: tidyLowerCase(state.tForm),
            langForm: tidyLowerCase(state.langForm),
        };

        if (state.komparativ.trim() !== '') {
            item.komparativ = tidyLowerCase(state.komparativ);
            item.superlativ = tidyLowerCase(state.superlativ);
        }

        // no toLowerCase
        let tmp = TextTidier.normaliseWhitespace(state.engelsk);
        if (tmp !== '') item.engelsk = tmp;

        return item;
    }

    handleChange(e, field) {
        const newState = this.state;
        newState[field] = e.target.value;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
    }

    handleBøjning(e) {
        const newState = this.state;

        const bøjning = e.target.value.toLowerCase(); // no trim
        newState.bøjning = bøjning;

        const result = new Bøjning().expandAdjektiv(
            TextTidier.normaliseWhitespace(this.state.grundForm),
            TextTidier.normaliseWhitespace(bøjning),
        );

        if (result) {
            Object.keys(result).map(k => newState[k] = result[k]);
        }

        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
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
                <p>{t('my_vocab.add_adjective.help_1')}</p>
                <p>{t('my_vocab.add_adjective.help_2')}</p>
                <p>{t('my_vocab.add_adjective.help_3')}</p>
                <p>{t('my_vocab.add_adjective.help_4')}</p>

                <table>
                    <tbody>
                        <tr>
                            <td>{t('my_vocab.add_adjective.grund_form.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.grundForm}
                                    onChange={(e) => this.handleChange(e, 'grundForm')}
                                    autoFocus="yes"
                                    ref={this.firstInputRef}
                                    data-test-id="grundForm"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_adjective.inflection.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bøjning}
                                    onChange={(e) => this.handleBøjning(e)}
                                    data-test-id="bøjning"
                                />
                                {' '}
                                <i>{t('my_vocab.add_adjective.inflection.example')}</i>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_adjective.t_form.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.tForm}
                                    onChange={(e) => this.handleChange(e, 'tForm')}
                                    data-test-id="tForm"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_adjective.lang_form.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.langForm}
                                    onChange={(e) => this.handleChange(e, 'langForm')}
                                    data-test-id="langForm"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_adjective.komparitiv.label')}:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.komparativ}
                                    onChange={(e) => this.handleChange(e, 'komparativ')}
                                    data-test-id="komparativ"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_adjective.superlativ.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.superlativ}
                                    onChange={(e) => this.handleChange(e, 'superlativ')}
                                    data-test-id="superlativ"
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
                                    data-test-id="engelsk"
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

AddAdjektiv.propTypes = {
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default withTranslation()(AddAdjektiv);
