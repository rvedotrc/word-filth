import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import TextTidier from '../../../shared/text_tidier';

class AddPhrase extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.firstInputRef = React.createRef();
    }

    initialState() {
        const s = {
            dansk: '',
            engelsk: '',
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state) {
        // no toLowerCase
        const dansk = TextTidier.normaliseWhitespace(state.dansk);
        const engelsk = TextTidier.normaliseWhitespace(state.engelsk);
        if (!(
            dansk !== ''
            && engelsk !== ''
        )) return null;

        const item = {
            type: 'udtryk',
            dansk,
            engelsk,
        };

        return item;
    }

    handleChange(e, field) {
        const newState = this.state;
        newState[field] = e.target.value;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
        this.props.onSearch(newState.dansk);
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
                <h2>{t('my_vocab.add_phrase.heading')}</h2>

                <p>{t('my_vocab.add_phrase.help')}</p>

                <table>
                    <tbody>
                        <tr>
                            <td>{t('question.shared.label.danish')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.dansk}
                                    onChange={(e) => this.handleChange(e, 'dansk')}
                                    autoFocus="yes"
                                    ref={this.firstInputRef}
                                    data-test-id="dansk"
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

AddPhrase.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired
};

export default withTranslation()(AddPhrase);
