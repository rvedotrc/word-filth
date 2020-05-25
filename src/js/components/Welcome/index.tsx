import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

class Welcome extends React.Component<WithTranslation, {}> {

    render() {
        const { t } = this.props;

        return (
            <div>
                <h2 id="welcomeHeader">{t('welcome.header')}</h2>
                <h1>Word Filth</h1>
                <p>{t('welcome.para_1')}</p>
                <p>{t('welcome.para_2')}</p>
            </div>
        )
    }

}

export default withTranslation()(Welcome);
