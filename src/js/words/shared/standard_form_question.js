import React from 'react';
import PropTypes from 'prop-types';

export const defaultState = function () {
    return {
        attempts: [],
        fadingMessage: null,
        showPraise: false,
        showCorrectAnswer: false,
    };
};

// renderShowCorrectAnswer(givenAnswers)
// renderPraise
// renderQuestionForm

// getGivenAnswer => object | falsey
// checkAnswer(givenAnswer) => true, false

export const onAnswer = function () {
    const { t } = this.props;

    const givenAnswer = this.getGivenAnswer();

    if (!givenAnswer) {
        this.showFadingMessage(t('question.shared.answer_must_be_supplied'));
        return;
    }

    const isCorrect = this.checkAnswer(givenAnswer);
    this.props.onResult(isCorrect);

    if (isCorrect) {
        this.setState({ showPraise: true });
    } else {
        const attempts = this.state.attempts.concat(givenAnswer);
        this.setState({ attempts });
        this.showFadingMessage(t('question.shared.not_correct'));
    }
};

export const onGiveUp = function () {
    this.props.onResult(false);
    this.setState({ showCorrectAnswer: true });
};

export const showFadingMessage = function (message, timeout) {
    this.setState({ fadingMessage: message });
    const t = this;
    window.setTimeout(() => {
        t.setState(prevState => {
            if (prevState.fadingMessage === message) {
                return({ fadingMessage: null });
            } else {
                return {};
            }
        });
    }, timeout || 2500);
};

export const render = function () {
    const { t } = this.props;

    if (this.state.showCorrectAnswer) {
        return (
            <div>
                {this.renderShowCorrectAnswer(this.state.attempts)}
                <p>
                    <input
                        type="button"
                        value={t('question.shared.continue.button')}
                        onClick={this.props.onDone}
                        autoFocus="yes"
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
        );
    }

    if (this.state.showPraise) {
        return (
            <div>
                {this.renderPraise()}
                <p>
                    <input
                        type="button"
                        value={t('question.shared.continue.button')}
                        onClick={this.props.onDone}
                        autoFocus="yes"
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
        );
    }

    const { fadingMessage } = this.state;

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); this.onAnswer(); }}
            onReset={(e) => { e.preventDefault(); this.onGiveUp(); }}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
        >
            {this.renderQuestionForm()}

            <p>
                <input type="submit" value={t('question.shared.answer.button')}/>
                <input type="reset" value={t('question.shared.give_up.button')}/>
                <input type="button" value={t('question.shared.skip.button')} onClick={this.props.onDone}/>
            </p>

            {fadingMessage && (
                <p key={fadingMessage}>{fadingMessage}</p>
            )}
        </form>
    );
};

export const propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,

    hasGimme: PropTypes.bool.isRequired,
    gimmeUsed: PropTypes.bool.isRequired,

    onResult: PropTypes.func.isRequired,
    onGimme: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
};
