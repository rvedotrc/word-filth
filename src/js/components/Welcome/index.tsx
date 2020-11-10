import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./index.css");

const Welcome = (props: WithTranslation) => {
    const { t } = props;

    return (
        <div>
            <h2 className={styles.welcomeHeader}>{t('welcome.header')}</h2>
            <h1>Word Filth</h1>
            <p>{t('welcome.para_1')}</p>
            <p>{t('welcome.para_2')}</p>
        </div>
    );
}

export default withTranslation()(Welcome);
