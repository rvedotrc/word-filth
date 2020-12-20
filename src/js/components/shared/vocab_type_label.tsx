import * as React from "react";
import {withTranslation, WithTranslation} from "react-i18next";
import {VocabEntryType} from "lib/types/question";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('@components/shared/vocab_type_label.css');

const VocabTypeLabel = (props: {type: VocabEntryType} & WithTranslation) => (
    <p className={styles.vocabTypeLabel} data-vocabtype={props.type}>
        {props.t(`question.shared.label.${props.type}`)}
    </p>
);

export default withTranslation()(VocabTypeLabel);
