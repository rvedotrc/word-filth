import * as React from "react";
import {WithTranslation, withTranslation} from 'react-i18next';
import {Question} from "lib/types/question";
import {useState} from "react";
import SFQ2 from "../Tester/sfq2";
import {Recorder} from "lib/recorder";

type Props = {
    question: Question<any, any>;
    onClose: () => void;
} & WithTranslation

const TestDriveQuestion = (props: Props) => {
    const [log, setLog] = useState<string[]>([]);

    const addLog = (line: string) => {
        setLog([...log, line]);
    };

    const {question} = props;

    const recorder: Recorder = {
        recordAnswer: async (isCorrect: boolean) => addLog(`recordAnswer ${isCorrect}`),
        isCorrect: () => undefined,
    };

    return (
        <>
            <button onClick={props.onClose}>Close</button>

            <h2>Test Area</h2>
            <div style={{border: "1px solid red", padding: "1em"}}>
                <SFQ2
                    question={question}
                    recorder={recorder}
                    onDone={() => addLog('onDone()')}
                    />
            </div>

            <h2>Callbacks</h2>
            <pre>{log.join('\n')}</pre>

            <h2>Question Data</h2>
            <pre>{JSON.stringify(question, null, 2)}</pre>
        </>
    );
};

export default withTranslation()(TestDriveQuestion);
