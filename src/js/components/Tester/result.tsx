import * as React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';
import {Question} from "lib/types/question";
import ShowVocabSources from "./show_vocab_sources";
import {useMemo, useState} from "react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./result.css");

type Props<T, C, Q extends Question<T, C>> = {
    question: Q;
    attempts: T[];
    firstAttemptCorrect: boolean | undefined;
    onRecordResult: (isCorrect: boolean) => Promise<void>;
    onNextQuestion: () => void;
} & WithTranslation

const SFQ2Result = <T, C, Q extends Question<T, C>>(props: Props<T, C, Q>) => {
    const {t} = props;

    const [isCorrect, setIsCorrect] = useState<boolean>(!!props.firstAttemptCorrect);

    const AttemptComponent = useMemo(() => withTranslation()(
        props.question.getAttemptComponent()
    ), [props.question.resultsKey]);

    const CorrectResponseComponent = useMemo(() => withTranslation()(
        props.question.getCorrectResponseComponent()
    ), [props.question.resultsKey])

    const nextIfEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') props.onNextQuestion();
    };

    return <div className={"result"}>

        {props.attempts.length > 0 && (<>
            <h2>{t('question.shared.your_attempts')}</h2>

            <ol>
                {props.attempts.map((attempt, idx) =>
                    <li key={idx}>
                        <AttemptComponent attempt={attempt}/>
                    </li>
                )}
            </ol>
        </>)}

        <h2>{t('question.shared.correct_answers')}</h2>

        <CorrectResponseComponent correct={props.question.correct}/>

        <p>
            <input
                type="button"
                value={"" + t('question.shared.continue.button')}
                onClick={props.onNextQuestion}
                autoFocus={true}
                data-testid="continue"
            />
        </p>

        <div className={styles.gimmeBlock}>
            <div className={styles.gimmeMark}>{isCorrect ? "✅" : "❌"}</div>
            <div className={styles.gimmeInputs}>
                <label>
                    <input
                        type={"radio"}
                        name={"currentResult"}
                        checked={isCorrect}
                        onChange={() => setIsCorrect(true)}
                        onKeyDown={nextIfEnter}
                    />
                    {t('question.shared.gimme.record_as_correct')}
                </label>
                <label>
                    <input
                        type={"radio"}
                        name={"currentResult"}
                        checked={!isCorrect}
                        onChange={() => setIsCorrect(false)}
                        onKeyDown={nextIfEnter}
                    />
                    {t('question.shared.gimme.record_as_incorrect')}
                </label>
            </div>
        </div>

        <ShowVocabSources vocabSources={props.question.vocabSources}/>

    </div>;
};

export default withTranslation()(SFQ2Result);
