import * as React from "react";
import {WithTranslation, withTranslation} from 'react-i18next';
import {Question} from "../../words/CustomVocab/types";
import {useState} from "react";
import SFQ2 from "../../words/shared/standard_form_question2";
import SpacedRepetition, {Recorder} from "../../SpacedRepetition";

type Props = {
    question: Question<any>;
    onClose: () => void;
} & WithTranslation

const TestDriveQuestion = (props: Props) => {
    const [log, setLog] = useState<string[]>([]);
    const [currentResult, setCurrentResult] = useState<boolean>();

    const addLog = (line: string) => {
        setLog([...log, line]);
    };

    const {question} = props;

    const recorder: Recorder = {
        recordAnswer: async (isCorrect: boolean) => addLog(`recordAnswer ${isCorrect}`),
        isCorrect: () => undefined,
    };

    return (
        <div>
            <button onClick={props.onClose}>Close</button>

            <h2>Test Area</h2>
            <div className="container" style={{border: "1px solid red", padding: "1em"}}>
                <SFQ2
                    question={question}
                    recorder={recorder}
                    onDone={() => addLog('onDone()')}
                    />
                {/*{question.createQuestionForm({*/}
                {/*    // There must be a better way of doing this ...*/}
                {/*    t: props.t,*/}
                {/*    i18n: props.i18n,*/}
                {/*    tReady: props.tReady,*/}

                {/*    key: question.resultsKey,*/}
                {/*    onResult: async isCorrect => {*/}
                {/*        addLog(`onResult(${isCorrect})`);*/}
                {/*        setCurrentResult(isCorrect);*/}
                {/*    },*/}
                {/*    currentResult,*/}
                {/*    onDone: () => {*/}
                {/*        addLog('onDone()');*/}
                {/*    },*/}
                {/*})}*/}
            </div>

            <h2>Callbacks</h2>
            <pre>{log.join('\n')}</pre>

            <h2>Question Data</h2>
            <pre>{JSON.stringify(question, null, 2)}</pre>
        </div>
    );
};

export default withTranslation()(TestDriveQuestion);
