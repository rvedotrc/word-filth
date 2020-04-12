import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import ExternalLinker from '../../../shared/external_linker';
import ShowCorrectAnswers from './show_correct_answers';

class ReviewCorrectAnswer extends Component {
    allAttempts() {
        const { attempts } = this.props;
        if (attempts.length === 0) return '-';

        var i = 0;
        return attempts
            .map(attempt => <span key={"attempt" + (++i)}>
                {attempt.nutid}, {attempt.datid}, {attempt.førnutid}
            </span>)
            .reduce((prev, curr) => [prev, <br key="br"/>, 'så: ', curr])
    }

    render() {
        const { t, infinitive, verbs } = this.props;

        // TODO: norsk? At the moment the built-in verbs are all Danish.
        const ddoLink = ExternalLinker.toDDO(infinitive.replace(/^(at|å) /, ''));
        const gtLink = ExternalLinker.toGoogleTranslate(infinitive);

        return (
            <div>
                <p>
                    {t('question.shared.wrong.you_answered')}{' '}
                    {this.allAttempts()}
                </p>
                <p>
                    {t('question.shared.wrong.but_it_was')}{' '}
                    {new ShowCorrectAnswers(verbs).allAnswers()}
                </p>
                <p>
                    <a href={ddoLink}>{t('question.builtin_verb.given_infinitive.read_more_at_ddo')}</a>
                    <span style={{marginLeft: '0.7em', marginRight: '0.7em'}}>|</span>
                    <a href={gtLink}>{t('question.builtin_verb.given_infinitive.translate_with_google')}</a>
                </p>
                <p>
                    <input
                        type="button"
                        value={t('question.shared.continue.button')}
                        autoFocus={'yes'}
                        onClick={this.props.onClose}
                        data-test-id="continue"
                    />
                    {this.props.hasGimme && (
                        <input
                            type="button"
                            value={t('question.shared.gimme.button')}
                            disabled={this.props.gimmeUsed}
                            onClick={this.props.onGimme}
                            data-test-id="gimme"
                            className="gimme"
                        />
                    )}
                </p>
            </div>
        )
    }
}

ReviewCorrectAnswer.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    infinitive: PropTypes.string.isRequired,
    verbs: PropTypes.array.isRequired,

    hasGimme: PropTypes.bool.isRequired,
    gimmeUsed: PropTypes.bool.isRequired,

    attempts: PropTypes.array.isRequired,
    onGimme: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default withTranslation()(ReviewCorrectAnswer);
